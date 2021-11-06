import ace from 'atlassian-connect-express';
import app from "./app";
import logger from "./utils/logger";

import Jira from "./service/jira";

// @ts-ignore
const addon = ace(app, {}, logger); // new Addon(app, opts || {}, logger || defLogger, callback);

addon.on("host_settings_saved", async (accountId, data) => {
    try {
        // return; // temporary disabled

        const httpClient = addon.httpClient({clientKey: accountId});
        const context = {
            http: httpClient,
            userAccountId: data.userAccountId
        };
        const jira = new Jira(context);

    } catch (e) {
        logger.error(e);
    }

});


export default addon;
