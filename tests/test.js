const controller = require("../src/workers/controller/downloader");


async function main() {
    const job = {
        data: {
            link: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/ARES_soaring_over_Mars.jpg/1200px-ARES_soaring_over_Mars.jpg",
            path: "images/"
        }
    }
   await controller.downloadImage(job, (msg) => {
       console.log(msg)
   });
}

main();