module.exports = (sequelize, Sequelize) => {
    const LessonTimetable = sequelize.define(
        "LessonTimetable",
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
            image: {
                type: Sequelize.STRING,
            },
            subject: {
                type: Sequelize.STRING,
            },
            day: {
                type: Sequelize.STRING,
            },
            hour: {
                type: Sequelize.TIME,
            },
            teacher: {
                type: Sequelize.STRING,
            },
            class: {
                type: Sequelize.STRING,
            },
            semester: {
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
            tableName: "lesson_timetables",
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

    User.hasMany(LessonTimetable, {foreignKey: "userId"});
    LessonTimetable.belongsTo(User, {foreignKey: "userId"});

    return LessonTimetable;
};
