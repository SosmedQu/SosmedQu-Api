const {School} = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const axios = require("axios");

const getSchool = async (req, res) => {
    const level = req.query.jenjang;
    const school = req.query.sekolah;

    try {
        if (level && school) {
            const schools = await School.findAll({where: {[Op.and]: [{level}, {school: {[Op.like]: `%${school}%`}}]}});

            if (schools.length == 0) return res.status(404).json({msg: "Not Found"});

            return res.status(200).json({schools});
        }

        if (level) {
            const schools = await School.findAll({where: {level}});

            if (schools.length == 0) return res.status(404).json({msg: "Not Found"});

            return res.status(200).json({schools});
        }

        if (school) {
            const schools = await School.findAll({
                where: {
                    school: {[Op.like]: `%${school}%`},
                },
            });

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
        // axios.get("https://api-sekolah-indonesia.herokuapp.com/sekolah?page=1&perPage=5").then((response) => {
        //     const schools = response.data;
        //     return res.status(200).json({schools});
        // });
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

// const test = async (req, res) => {
//     try {
//         const schools = await axios.get("https://api-sekolah-indonesia.herokuapp.com/sekolah?page=1&perPage=5");

//         schools.data.dataSekolah.forEach(async (school) => {
//             await axios.post("http://localhost:3000/api/schools", {
//                 provinceCode: school.kode_prop,
//                 province: school.propinsi,
//                 districtCode: school.kode_kab_kota,
//                 district: school.kabupaten_kota,
//                 subDistrictCode: school.kode_kec,
//                 subDistrict: school.kecamatan,
//                 schoolId: school.id,
//                 npsn: school.npsn,
//                 school: school.sekolah,
//                 level: school.bentuk,
//                 status: school.status,
//                 streetAddress: school.alamat_jalan,
//                 latitude: school.lintang,
//                 longitude: school.bujur,
//             });
//         });

//         return res.status(200).json({msg: "Berhasil"});
//     } catch (err) {
//         console.log(err);
//         return res.sendStatus(500);
//     }
//     // return res.json({schools.data});
// };

module.exports = {getSchool, createSchool};
