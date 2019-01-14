const express = require("express");

const controller = require("../controllers/main");

const app = express();


app.post("/crawl/images", controller.crawlImages);

app.get("/images", controller.getImages);

app.get("/statistics", controller.getStatistics)


module.exports = app;