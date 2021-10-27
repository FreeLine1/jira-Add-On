import express from "express";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
const axios = require('axios').default;
const router = express.Router();



router.get("/", async (req, res) => {
    res.redirect("/atlassian-connect.json");
});

router.post("/sign",(req, res) => {
    console.log('new file');
    const body = req.body.file;
    const base64Data = body.replace(/^data:image\/png;base64,/,"");
    const binaryData = Buffer.from(base64Data, 'base64').toString('binary');
    fs.writeFile("out.png", binaryData, "binary", err => {

    });

    let data = new FormData();

    data.append('file', fs.createReadStream('out.png'));

    let config = {
        method: 'post',
        url: 'https://maxym-dev.atlassian.net/rest/api/3/issue/SFL-1/attachments',
        headers: {
            'X-Atlassian-Token': 'no-check',
            'Authorization': 'Basic bWF4aWsuNTV0QGdtYWlsLmNvbTpRMjRJU3FDM2lnaDhsa3FGc3BuTEEwQUQ=',
            ...data.getHeaders()
        },
        data : data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });



})

export default router;
