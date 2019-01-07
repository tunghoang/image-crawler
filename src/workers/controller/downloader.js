const rp = require("request-promise");
const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require("cheerio");

const jobAPI = require("../../jobs/crawl-image");
const serviceAPI = require("../../services/sellpro-proxy");

async function downloadImage(job, done) {
    try {
        const { link, path } = job.data;

        const data = await rp({
            uri: link,
            method: "GET",
            encoding: null
        })

        const buffer = Buffer.from(data);
        fs.writeFileSync(path + encodeURIComponent(link), buffer);

        done();
    }
    catch (err) {
        console.log("downloadImage", err.message);
        done(err.message);
    }
}

async function crawlImage(job, done) {
    try {
        let html = await renderPage(job.data.word);
        let links = await extractLinks(html);

        for (link of links) {
            await jobAPI.createDownloadJob(link, "images/");
        }

    } catch (err) {
        console.log("crawlImage", err.message);
        done(err.message);
    }
}

// HELPER FUNCTIONS

async function renderPage(word) {
    // const response = await serviceAPI.getProxy();
    // console.log(response);
    // const proxyUrl = `${response.data.ip}:${response.data.port}`
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        defaultViewport: {
            width: 1200,
            height: 800
        },
        args: ['--disable-setuid-sandbox',
            '--no-sandbox',
            '--ignore-certificate-errors',
            //      `--proxy-server=${proxyUrl}`
        ]
    });
    try {
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", request => {
            if (request.resourceType() === 'image') request.abort();
            else request.continue();
        })

        await page.goto("https://google.com", {
            waitUntil: 'networkidle0'
        });

        await click(page, "input.glFyf.gsfi, input[name='q']");

        await page.type("input.glFyf.gsfi, input[name='q']", word, {
            delay: 100
        })

        await page.keyboard.press("Enter");

        await page.waitForNavigation({
            waitUntil: 'networkidle0'
        })

        await clickNav(page, "a.q.qs");

        await autoScroll(page);

        let content = await page.content();

        console.log("done");
        return content;

    } catch (err) {
        console.log(err.message);
    } finally {
        await browser.close();
    }
}

async function click(page, selector) {
    await page.hover(selector);
    await page.click(selector, {
        button: "left",
        clickCount: 1,
        delay: 100
    })
}

async function clickNav(page, selector) {
    await page.hover(selector);

    await Promise.all([
        page.click(selector, {
            button: "left",
            clickCount: 1,
            delay: 100
        }),
        page.waitForNavigation({
            waitUntil: 'domcontentloaded'
        })
    ])

}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise(async (resolve, reject) => {
            let height = 0;
            let distance = 100;
            let timer = setInterval(async () => {
                window.scrollBy(0, distance);
                height += distance;
                if (height >= document.body.scrollHeight) {
                    let element = document.getElementById("smc");
                    let style = window.getComputedStyle(element);
                    if (style.display != "none") {
                        document.getElementById("smb").click();
                    }
                    else {
                        clearInterval(timer);
                        resolve();
                    }
                }
            }, 100);
        })
    })
}

function formatLink(url) {
    return (url.indexOf('?') != -1) ? url.substring(0, url.indexOf('?')) : url;
}

async function extractLinks(html) {
    try {

        const $ = cheerio.load(html);
        const data = $("div.rg_meta.notranslate").map(function (i, element) {
            return JSON.parse($(this).text());
        });

        let arr = data.toArray().map((value, i) => {
            return formatLink(value.ou);
        })

        return arr;
    } catch (err) {
        console.log("extractLinks", err.message);
    }
}


module.exports = {
    downloadImage,
    crawlImage
};