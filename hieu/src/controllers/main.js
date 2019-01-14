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

async function getImages(req, res) {
    try {
        const keyword = req.query.keyword;
        let data;
        if (keyword) {
            data = await Keyword.findAll({
                where: {
                    word: keyword
                },
                include: [{
                    model: Image,
                    attributes: ['link']
                }]
            });
        } else {
            data = await Keyword.findAll({
                include: [{
                    model: Image,
                    attributes: ['link']
                }]
            })
        }

        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
}

async function getStatistics(req, res) {
    try {
        const keyword = req.query.keyword;
        let data;
        if (keyword) {
            data = await Keyword.findOne({
                where: {
                    word: keyword
                },
                attributes: ['word', [db.sequelize.fn('COUNT', 'images'), 'imagesCount']],
                raw: true,
                include: [
                    {
                        model: Image,
                        attributes: []
                    }
                ],
            });
        } else {
            data = await Keyword.findAll({
                group: 'word',
                attributes: ['word', [db.sequelize.fn('COUNT', 'images'), 'imagesCount']],
                raw: true,
                include: [
                    {
                        model: Image,
                        attributes: []
                    }
                ],
            })
        }

        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
}


module.exports = {
    crawlImages,
    getStatistics,
    getImages
}