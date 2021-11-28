import addon from "../addon";
import express from "express";
const router = express.Router();


// @ts-ignore
router.post("/sign", addon.checkValidToken(), (req, res) => {
    const httpClient = addon.httpClient(req);

    const {
        file,
        name: userName,
        issueKey
    } = req.body;

    const attachmentConfig = {
        url: `/rest/api/3/issue/${issueKey}/attachments`,
        headers: {
            'X-Atlassian-Token': 'no-check',
            'Content-Type': 'multipart/form-data'
        },
        form: {
            file: [
                Buffer.from(file.replace(/^data:image\/png;base64,/, ""), 'base64'),
                {
                    filename: userName,
                    contentType: 'image/png'
                }
            ]
        }
    };

    const commentConfig = {
        url: `/rest/api/3/issue/${issueKey}/comment`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "body": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "text": `Signature was made by ${userName}`,
                                "type": "text"
                            }
                        ]
                    }
                ]
            }
        })
    };


    Promise.all([httpClient.post(attachmentConfig), httpClient.post(commentConfig)])
        .then(() => res.status(200).json({status: "OK"}))

})

export default router;

