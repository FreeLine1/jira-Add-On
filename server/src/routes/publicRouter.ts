import express from "express";
import fs from "fs";
const router = express.Router();

router.get("/", async (req, res) => {
    res.redirect("/atlassian-connect.json");
});

router.post("/sign",async (req, res) => {
    console.log('new file');
    const base64file = req.body.file;
    var body = req.body.file,
        base64Data = body.replace(/^data:image\/png;base64,/,""),
        binaryData = new Buffer(base64Data, 'base64').toString('binary');

    require("fs").writeFile("out.png", binaryData, "binary", function(err) {
        console.log(err); // writes out file without error, but it's not a valid image
    });

    const filePath = 'out.png';
    const form = new FormData();
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileStream = fs.createReadStream(filePath);
    const image = new Blob(fs.unlinkSync(filePath));
    form.append('file', image);

        fetch('https://maxym-dev.atlassian.net/rest/api/3/issue/SFL-1/attachments', {
            method: 'POST',
            body: form,
            headers: {
                'Authorization': `Basic bWF4aWsuNTV0QGdtYWlsLmNvbTpRMjRJU3FDM2lnaDhsa3FGc3BuTEEwQUQ=`,
                'Accept': 'application/json',
                'X-Atlassian-Token': 'no-check'
            }
        })
            .then(response => {
                console.log(
                    `Response: ${response.status} ${response.statusText}`
                );
                return response.text();
            })
            .then(text => console.log(text))
            .catch(err => console.error(err));

})

export default router;
