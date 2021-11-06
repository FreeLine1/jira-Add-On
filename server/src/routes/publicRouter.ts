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
    const base64Data = body.replace(/^data:image\/png;base64,/, "");
    const binaryData = Buffer.from(base64Data, 'base64').toString('binary');
    fs.writeFile("out.png", binaryData, "binary", err => {

    });

    const data = new FormData();
    data.append('file', fs.createReadStream('out.png'));

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




    const bodyData = JSON.stringify({
        "body": {
            "type": "doc",
            "version": 1,
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget venenatis elit. Duis eu justo eget augue iaculis fermentum. Sed semper quam laoreet nisi egestas at posuere augue semper.",
                            "type": "text"
                        }
                    ]
                }
            ]
        }
    });

    // Returns  TypeError: Cannot read properties of undefined (reading 'post')
    async function postCommentToIssue(issueKey, httpClient, type, group, jira) {
        // const time = group[type + "TimeLimit"].split(":");

        const bodyMessage = `{
              "body": {
                "type": "doc",
                "content": [
                  {
                  "type": "paragraph",
                    "content": [
                      {
                        "type": "text",...
 ],
                "version": 1
              }
            }`;
        console.log(bodyMessage);

       await  httpClient.post({
            url: `/rest/api/3/issue/SFL-1/comment`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: bodyMessage
        }, (err, response, body) => {
            if (err) console.error(err);
            console.log("comment " + response.statusCode);
            console.log("body " + body);
        });
    }
    // @ts-ignore
    postCommentToIssue();
    })




export default router;
