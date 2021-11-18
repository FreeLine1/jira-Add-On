import express from "express";
import path from 'path';
import addon from "../addon";
const router = express.Router();

const serveIndex = (res, next) => {
    try {
        // throw new HttpNotFound("not found", {op: "Get main page"}); // error example
        res.sendFile(path.join(__dirname, '../../../', 'client', 'build', 'index.html'));
    } catch (e) {
        next(e);
    }
}

const indexRoutes = ["/main", "/web-panel"];


router.get(indexRoutes, async (req, res, next) => {
    serveIndex(res, next);
});

export default router;
