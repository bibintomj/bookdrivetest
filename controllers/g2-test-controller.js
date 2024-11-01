// File Imports
const {
    insertUser,
    findUserWithCredentials,
    findUserWithLicenseNumber,
    updateCarInfoForUser,
} = require("../core/g2-test");

const g2 = (req, res) => {
    res.render("g2-test");
}


const g2Register = async (req, res) => {
    await insertUser(req.body);
    res.redirect("/");
}

module.exports = { g2, g2Register }