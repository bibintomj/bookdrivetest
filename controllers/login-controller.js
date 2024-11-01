
const {
    insertUser,
    findUserWithCredentials,
    findUserWithLicenseNumber,
    updateCarInfoForUser,
} = require("../core/g2-test");

const loginPage = (req, res) => {
    res.render("login");
}

const loginAction = async (req, res) => {
    const { status, message, user } = await findUserWithCredentials(req.body.username, req.body.password);
    return res.status(status).json({ message: message, user })
}

module.exports = { loginPage, loginAction }