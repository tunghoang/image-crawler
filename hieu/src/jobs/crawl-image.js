const kue = require("kue");
const config = require("config");

const redis = config.get("redis");
const queue = kue.createQueue({ redis });

function createDownloadJob(link, path) {
    queue.create("download-image", {
        link,
        path
    })
        .priority("medium")
        .ttl(10000)
        .attempts(1)
        .save();
}

function createCrawlImageJob(word) {
    queue.create("crawl-images", {
        word
    })
        .priority("medium")
        .ttl(60000)
        .attempts(1)
        .save();
}

module.exports = {
    createDownloadJob,
    createCrawlImageJob
}