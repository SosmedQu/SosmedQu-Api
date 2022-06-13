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

    return LessonTimetable;
};
