module.exports = (sequelize, Sequelize) => {
    const EbookCategory = sequelize.define(
        "EbookCategory",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            category: {
                type: Sequelize.STRING,
            },
        },
        {
            freezeTableName: true,
            tableName: "ebook_categories",
        }
    );

    return EbookCategory;
};
