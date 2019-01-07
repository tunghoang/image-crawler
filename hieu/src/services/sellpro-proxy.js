const rp = require("request-promise");

function getProxy() {
    return rp({
        uri: `https://dev.sellpro.vn/api/v1/services/proxy`,
        json: true,
        method: "GET"
    })
        .catch(err => {
            console.log("getProxy", err.message);
        })
}

module.exports = {
    getProxy
}