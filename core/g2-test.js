const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require('bcrypt')

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
        username: info.username,
        password: info.password,
        userType: info.userType,
        age: info.dob == undefined ? undefined : getAgeFromDOB(info.dob),
        carDetails: car,
    };
    User.create(user);
}

async function findUserWithCredentials(username, password) {
    try {
        const user = await User.findOne({ username: username })
        if (user) {
            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (passwordsMatch) {
                return { status: 200, message: "Login successful", user }
            } else {
                return { status: 400, message: "Invalid credentials", user: null }
            }
        } else {
            return { status: 400, message: "Invalid credentials", user: null }
        }
    } catch(error) {
        return { status: 500, message: "Error logging in > " + error, user: null }
    }
}

async function findUserWithLicenseNumber(licenseNumber) {
    // const hashedLicenceNumber = await hash(licenseNumber, 10);
    return await User.findOne({ licenseNumber: licenseNumber });
}

async function hash(value, saltRounds) {
    const hashed = await new Promise((resolve, reject) => {
      bcrypt.hash(value, saltRounds, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
    return hashed
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
    findUserWithCredentials,
    findUserWithLicenseNumber,
    updateCarInfoForUser,
};
