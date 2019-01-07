const kue = require("kue");
const config = require("config");

const controller = require("./controller/downloader");

const redis = config.get("redis");
const queue = kue.createQueue({redis});

queue.setMaxListeners(100);

queue.process("download-image", 10, controller.downloadImage);

queue.process("crawl-images", 2, controller.crawlImage);