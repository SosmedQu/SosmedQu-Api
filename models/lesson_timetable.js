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
                defaultValue: "default.jpg",
            },
            subject: {
                type: Sequelize.STRING,
            },
            dayId: {
                type: Sequelize.INTEGER,
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

    const Day = sequelize.define(
        "Day",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            day: {
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
            tableName: "days",
        }
    );

    User.hasMany(LessonTimetable, {foreignKey: "userId"});
    LessonTimetable.belongsTo(User, {foreignKey: "userId"});
    Day.hasMany(LessonTimetable, {foreignKey: "dayId"});
    LessonTimetable.belongsTo(Day, {foreignKey: "dayId"});

    return LessonTimetable;
};
