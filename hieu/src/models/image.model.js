module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define("images", {
        hash: {
            type: Sequelize.STRING,
            unique: true
        }, 
        link: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Image;
}