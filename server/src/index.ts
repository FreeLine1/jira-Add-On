// Addon entry point
import express from "express";

import app from "./app";
import addon from "./addon";

// https://expressjs.com/en/guide/using-middleware.html
import bodyParser from 'body-parser';
import compression from 'compression';
import logger from "./utils/logger";
import morganMiddleware from "./utils/morganMiddleware";


// We also need a few stock Node modules
import http from 'http';
import path from 'path';
import os from 'os';
import helmet from 'helmet';
import nocache from 'nocache';

// Routes live here; this is the C in MVC
import preMiddlewareRouter from './routes/preMiddlewareRouter';
import router from './routes';
import cors from 'cors';

import db from "./service/db";
import publicRouter from "./routes/publicRouter";

const runApp = async () => {
    try {
        logger.info("App is starting...");

        // See config.json
        const port = addon.config.port();
        app.set('port', port);

        // Log requests, using an appropriate formatter by env
        const devEnv = app.get('env') === 'development';
        app.use(morganMiddleware);

        // Atlassian security policy requirements
        // http://go.atlassian.com/security-requirements-for-cloud-apps
        // HSTS must be enabled with a minimum age of at least one year
        app.use(helmet.hsts({
            maxAge: 31536000,
            includeSubDomains: false
        }));
        app.use(helmet.referrerPolicy({
            policy: ['origin']
        }));

        // Include request parsers
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));

        // Gzip responses when appropriate
        app.use(compression());

        app.use("/", preMiddlewareRouter);

        // @ts-ignore
        await addon.settings.connectionPromise; // connecting to db
        // @ts-ignore
        db.init(addon.settings.db);

        // Include atlassian-connect-express middleware
        app.use(addon.middleware());

        // Atlassian security policy requirements
        // http://go.atlassian.com/security-requirements-for-cloud-apps
        app.use(nocache());

        if (devEnv) {
            app.use(express.static(path.join(__dirname, '../../', 'client', 'build')));
        }

        if (process.env.STANDALONE) {
            app.use(cors());
        }

        // Wire up routes
        app.use(router);

        app.use((error, req, res, next) => {
            logger.error(error, req.context);
            req.error = error;
            res.status(error.statusCode || 500).json(error.data || {error: error.message});
        });

        // Boot the HTTP server
        http.createServer(app).listen(port, () => {
            logger.info('App server running at http://' + os.hostname() + ':' + port);
        });
    } catch (e) {
        logger.error(e);
        process.exit();
    }
}

process.on('uncaughtException', err => {
    console.log("Uncaught exception");
    logger.error(err);
    process.exit(1);
});

runApp();
