require("./workers/worker");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/main");
const db = require("./database");
const app = express();
const PORT = 6329;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use("/api/v1", routes);


try {
    db.sequelize.sync()
        .then(() => {
            app.listen(PORT, () => {
                console.log("Server is listening on port " + PORT);
            })
        }).catch(err => {
            console.log(err.message);
        })

} catch (err) {
    console.log(err.message);
}