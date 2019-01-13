const express = require("express");

const controller = require("../controllers/main");

const app = express();


app.post("/crawl/images", controller.crawlImages);


module.exports = app;