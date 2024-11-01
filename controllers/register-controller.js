
const {
    insertUser,
    findUserWithCredentials,
    findUserWithLicenseNumber,
    updateCarInfoForUser,
} = require("../core/g2-test");

const registerPage = (req, res) => {
    res.render("register");
}

const registerAction = async (req, res) => {
    await insertUser(req.body);
    res.redirect("/login");
}

module.exports = { registerPage, registerAction }