
const {
    insertUser,
    findUserWithId,
    findUserWithCredentials,
    findUserWithLicenseNumber,
    updateG2InfoForUser,
    updateCarInfoForUser,
} = require("../core/g2-test");

const registerPage = (req, res) => {
    res.render("register");
}

const registerAction = async (req, res) => {
    const response = await insertUser(req.body);
    res.status(response.status).json(response)
}

module.exports = { registerPage, registerAction }