// File Imports
const {
    insertUser,
    findUserWithId,
    findUserWithCredentials,
    findUserWithLicenseNumber,
    updateG2InfoForUser,
    updateCarInfoForUser,
} = require("../core/g2-test");


const g = (req, res) => {
    res.render("g-test", { id: "", user: null, error: null });
}

const gTestGetUser = async (req, res) => {
    const user = await findUserWithId(req.session.userId)
    let error = null;
    if (!user.licenseNumber) {
        error = "No records found";
    }
    console.log(req.params.username, user, error);
    res.render("g-test", { username: req.params.username, user, error });
}

const gTestUpdateUser = async (req, res) => {
    const data = req.body;
    await updateCarInfoForUser(data);
    res.json({ message: "Data received successfully" });
}

module.exports = { 
    g, gTestGetUser, gTestUpdateUser
}