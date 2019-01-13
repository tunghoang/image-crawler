const Sequelize = require("sequelize");
const config = require("config");

const database = config.get("database");

const sequelize = new Sequelize(database.name, database.username, database.password, database.options);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Keyword = require("./models/keyword.model")(sequelize, Sequelize);
db.Image = require("./models/image.model")(sequelize, Sequelize);


db.Keyword.hasMany(db.Image, {foreignKey: 'word', sourceKey: 'word'});
db.Image.belongsTo(db.Keyword, {foreignKey: 'word', targetKey: 'word'});

module.exports = db;

