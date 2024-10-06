const mongoose = require("mongoose");
const User = require("../models/User");

async function insertUser(info) {
    const getAgeFromDOB = (birthDate) =>
        Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

    const car = {
        make: info.make,
        model: info.model,
        year: info.year,
        plateNumber: info.plateNumber,
    };
    const user = {
        firstName: info.firstName,
        lastName: info.lastName,
        licenseNumber: info.licenseNumber,
        age: getAgeFromDOB(info.dob),
        carDetails: car,
    };
    User.create(user);
}

async function findUserWithLicenseNumber(licenseNumber) {
    return await User.findOne({ licenseNumber: licenseNumber });
}

async function updateCarInfoForUser(data) {
    return await User.findByIdAndUpdate(
        data.id,
        { $set: { carDetails: data.carDetails } },
        { new: true }
    );
}

module.exports = {
    insertUser,
    findUserWithLicenseNumber,
    updateCarInfoForUser,
};
