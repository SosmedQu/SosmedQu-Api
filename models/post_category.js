module.exports = (sequelize, Sequelize) => {
    const PostCategory = sequelize.define(
        "PostCategory",
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
            tableName: "post_categories",
        }
    );

    return PostCategory;
};
