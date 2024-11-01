// File Imports
const {
    insertUser,
    findUserWithCredentials,
    findUserWithLicenseNumber,
    updateCarInfoForUser,
} = require("../core/g2-test");


const g = (req, res) => {
    res.render("g-test", { id: "", user: null, error: null });
}

const gTestGetUser = async (req, res) => {
    const user = await findUserWithLicenseNumber(req.params.id);
    let error = null;
    if (user == null) {
        error = "No records found for this license number";
    }
    console.log(req.params.id, user, error);
    res.render("g-test", { id: req.params.id, user, error });
}

const gTestUpdateUser = async (req, res) => {
    const data = req.body;
    await updateCarInfoForUser(data);
    res.json({ message: "Data received successfully" });
}

module.exports = { 
    g, gTestGetUser, gTestUpdateUser
}