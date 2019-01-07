require("./src/workers/worker");
const jobsAPI = require("./src/jobs/crawl-image");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 6329;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.post("/crawl/images", async (req, res) => {
    try {
        await jobsAPI.createCrawlImageJob(req.body.query);
        return res.json({success: true});
    } catch(err) {
        return res.json({success: false});
    }
})


app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
})