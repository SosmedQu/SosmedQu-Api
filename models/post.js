module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define(
        "Post",
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
            caption: {
                type: Sequelize.TEXT,
            },
            privacy: {
                type: Sequelize.STRING,
                defaultValue: "public",
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
            tableName: "posts",
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
            postId: {
                type: Sequelize.INTEGER,
            },
            statusId: {
                type: Sequelize.INTEGER,
            },
            image: {
                type: Sequelize.STRING,
                defaultValue: "default.jpg",
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
                type: Sequelize.STRING,
            },
            studentCard: {
                type: Sequelize.TEXT,
            },
            nisn: {
                type: Sequelize.STRING,
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
    const PostFile = sequelize.define(
        "PostFile",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            postId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fileName: {
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
            tableName: "post_files",
        }
    );

    User.hasMany(Post, {foreignKey: "userId"});
    Post.belongsTo(User, {foreignKey: "userId"});
    PostCategory.hasMany(Post, {foreignKey: "categoryId"});
    Post.belongsTo(PostCategory, {foreignKey: "categoryId"});
    Post.hasMany(PostFile, {foreignKey: "postId"});
    PostFile.belongsTo(Post, {foreignKey: "postId"});

    return Post;
};
