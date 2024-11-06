// File Imports
const {
    insertUser,
    findUserWithId,
    findUserWithCredentials,
    findUserWithLicenseNumber,
    updateG2InfoForUser,
    updateCarInfoForUser,
} = require("../core/g2-test");

const g2 = async (req, res) => {
    if (req.session.userId) {
        const user = await findUserWithId(req.session.userId)
        if (user) {
            res.render("g2-test", { user });
        } else {
            res.render("g2-test");
        }
    } else {
        res.render("g2-test");
    }
}

const g2Register = async (req, res) => {
    const user = await findUserWithId(req.session.userId)
    await updateG2InfoForUser(req.body, user)
    res.redirect("/");
}

module.exports = { g2, g2Register }