module.exports = (sequelize, Sequelize) => {
    const Keyword = sequelize.define('keywords', {
        word: {
            type: Sequelize.STRING,
            primaryKey: true
        }
    })

    return Keyword;
}