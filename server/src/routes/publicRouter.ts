import express from "express";

const router = express.Router();
import addon from "../addon";
import apiRouter from './apiRouter';

router.get("/", async (req, res) => {
    res.redirect("/atlassian-connect.json");
});

// @ts-ignore
router.use("/api", addon.checkValidToken(), apiRouter);

export default router;
