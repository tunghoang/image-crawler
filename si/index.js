const puppeteer = require('puppeteer');
const imageName = "cat";
const download = require('image-downloader');
const base64Img = require('base64-img');


const run = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true
    })
    const page = await browser.newPage();

    const navigationPromise = page.waitForNavigation();
    await page.setViewport({ width: 1600, height: 1080 });
    await page.goto(`https://www.bing.com/images/search?q=${imageName}&FORM=HDRSC2`);

    await navigationPromise;
    let imageRowNth = 1;
    let rowth = `#mmComponent_images_1 > ul:nth-child(${imageRowNth})`;

    while (await page
        .waitForSelector(rowth, { timeout: 3000})
        .then((res) => {
            return true;
        })
        .catch(e => {
            console.log(e);
            return false
        })) {
        await page.evaluate(_ => {
            window.scrollBy(0, window.innerHeight);
        });
        let imageNth = 1;
        let imageSelector = rowth + ` > li:nth-child(${imageNth}) > div > div > a > div`;

        while (await page.waitForSelector(imageSelector, { timeout: 3000 })
            .then(() => {
                return true;
            })
            .catch(err => {
                return false;
            })) {
            let infoImage = await page.$eval(`#mmComponent_images_1 > ul:nth-child(${imageRowNth}) > li:nth-child(${imageNth}) > div > div > div`, e => e.innerHTML);
            let srcImage = await page.$eval(imageSelector, e => e.innerHTML);

            srcImage = srcImage.split('src="')[1].split('"')[0];

            if (srcImage[0] !== '/'
                && !srcImage.includes("https://www.bing.com")
                && !srcImage.includes("data")) {
                srcImage = '/' + srcImage;
            } else if (!srcImage.includes("https://www.bing.com")
                && !srcImage.includes("data"))
                srcImage = "https://www.bing.com" + srcImage;

            if (!srcImage.includes('data')) {
                infoImage = await infoImage.split('<')[1].split('· ')[1];
                if (infoImage === undefined) {
                    infoImage = "jpeg";
                }

                const fileName = await imageName + `${imageRowNth}-${imageNth}` + '.' + infoImage;

                let options = await {
                    url: srcImage,
                    dest: `./image/${fileName}`
                }

                await download.image(options)
                    .then(({ filename, image }) => {
                    })
                    .catch((err) => {

                        console.error(err)
                    })

                 } else {
                const fileName = await imageName + `${imageRowNth}-${imageNth}`;
                base64Img.img(srcImage,
                    './image',
                    fileName,
                    (err, filePath) => {
                        console.error(err);
                    })
            }
            imageNth++;
            imageSelector = await rowth + ` > li:nth-child(${imageNth}) > div > div > a > div`;
     
        }

        imageRowNth++;
        rowth = `#mmComponent_images_1 > ul:nth-child(${imageRowNth})`;


    }
};

run();
