const {School} = require("../models");

const getSchool = async (req, res) => {
    const level = req.query.jenjang;

    try {
        if (level) {
            const schools = await School.findAll({where: {level}});

            if (!schools) return res.status(404).json({msg: "Not Found"});

            return res.status(200).json({schools});
        }

        const schools = await School.findAll();
        if (!schools) return res.status(404).json({msg: "Not Found"});

        return res.status(200).json({schools});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createSchool = async (req, res) => {
    const {provinceCode, province, districtCode, district, subDistrictCode, subDistrict, schoolId, npsn, school, level, status, streetAddress, latitude, longitude} = req.body;

    try {
        const checkSchool = await School.findOne({where: {schoolId}});
        if (checkSchool) return res.status(404).json({msg: "Sekolah sudah terdaftar atau terdapat id yang sama"});

        await School.create({
            provinceCode,
            province,
            districtCode,
            district,
            subDistrictCode,
            subDistrict,
            schoolId,
            npsn,
            school,
            level,
            status,
            streetAddress,
            latitude,
            longitude,
        });

        return res.status(201).json({msg: "Sekolah berhasil ditambahkan"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getSchool, createSchool};
