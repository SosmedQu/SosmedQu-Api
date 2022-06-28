module.exports = (sequelize, Sequelize) => {
    const Ebook = sequelize.define(
        "Ebook",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.STRING,
            },
            fileName: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.TEXT,
            },
            writer: {
                type: Sequelize.STRING,
            },
            publisher: {
                type: Sequelize.STRING,
            },
            publicationYear: {
                type: Sequelize.STRING,
            },
            isbn: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
        },
        {
            freezeTableName: true,
            tableName: "ebooks",
        }
    );

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

    const User = sequelize.define(
        "User",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            roleId: {
                type: Sequelize.INTEGER,
            },
            statusId: {
                type: Sequelize.INTEGER,
            },
            username: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            accessToken: {
                type: Sequelize.TEXT,
            },
            gender: {
                type: Sequelize.STRING,
            },
            placeOfBirth: {
                type: Sequelize.STRING,
            },
            birthDay: {
                type: Sequelize.DATE,
            },
            noHp: {
                type: Sequelize.INTEGER,
            },
            studentCard: {
                type: Sequelize.TEXT,
            },
            nisn: {
                type: Sequelize.INTEGER,
            },
            studyAt: {
                type: Sequelize.STRING,
            },
            province: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
        },
        {
            freezeTableName: true,
            tableName: "users",
        }
    );

    User.hasMany(Ebook, {foreignKey: "userId"});
    Ebook.belongsTo(User, {foreignKey: "userId"});
    EbookCategory.hasMany(Ebook, {foreignKey: "categoryId"});
    Ebook.belongsTo(EbookCategory, {foreignKey: "categoryId"});

    return Ebook;
};
