import express from "express";
import fs from "fs";
import FormData from "form-data";
const axios = require('axios').default;
const router = express.Router();
import addon from "../addon";

router.get("/", async (req, res) => {
    res.redirect("/atlassian-connect.json");
});

router.post("/sign", (req, res) => {

    const body = req.body.file;
    const commentName = req.body.name;
    const base64Data = body.replace(/^data:image\/png;base64,/, "");
    const binaryData = Buffer.from(base64Data, 'base64').toString('binary');
    fs.writeFile("sign.png", binaryData, "binary", err => {
        console.log(err);
    });

    const data = new FormData();
    data.append('file', fs.createReadStream('sign.png'));

    const attachmentConfig = {
        method: 'post',
        url: 'https://maxym-dev.atlassian.net/rest/api/3/issue/SFL-1/attachments',
        headers: {
            'X-Atlassian-Token': 'no-check',
            'Authorization': 'Basic bWF4aWsuNTV0QGdtYWlsLmNvbTpRMjRJU3FDM2lnaDhsa3FGc3BuTEEwQUQ=',
            ...data.getHeaders()
        },
        data
    };

    axios(attachmentConfig)
        .then(response => {
            console.log(JSON.stringify(response.data));
            res.status(200).json({status: "OK"});
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({status: "Failed"});
        });


    async function postCommentToIssue() {

        const httpClient = addon.httpClient({clientKey: "3ee9d04b-2c3e-38fa-91b7-b9d98b76dece"});
        const bodyMessage = JSON.stringify({
            "body": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "text": `Signature was made by ${commentName}`,
                                "type": "text"
                            }
                        ]
                    }
                ]
            }
        });

        await httpClient.post({
            url: `/rest/api/3/issue/SFL-1/comment`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: bodyMessage
        }, (err) => {
            if (err) console.error(err);
        });
    }

    // @ts-ignore
    postCommentToIssue();
})


export default router;
