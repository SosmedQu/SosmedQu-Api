module.exports = (sequelize, Sequelize) => {
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
                type: Sequelize.STRING,
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

    const Role = sequelize.define(
        "Role",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            roleName: {
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
            tableName: "roles",
        }
    );

    Role.hasMany(User, {foreignKey: "roleId"});
    User.belongsTo(Role, {foreignKey: "roleId"});

    return User;
};
