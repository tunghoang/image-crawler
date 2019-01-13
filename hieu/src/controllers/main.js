const jobsAPI = require("../jobs/crawl-image");
const db = require("../database");

const Keyword = db.Keyword;
const Image = db.Image;

async function crawlImages(req, res) {
    try {
        await jobsAPI.createCrawlImageJob(req.body.query);
        await Keyword.create({
            word: req.body.query
        })
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
}

module.exports = {
    crawlImages
}