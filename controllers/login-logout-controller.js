
const {
    insertUser,
    findUserWithId,
    findUserWithCredentials,
    findUserWithLicenseNumber,
    updateG2InfoForUser,
    updateCarInfoForUser,
} = require("../core/g2-test");

const loginPage = (req, res) => {
    res.render("login");
}

const loginAction = async (req, res) => {
    const { status, message, user } = await findUserWithCredentials(req.body.username, req.body.password);
    if (status == 200 && user) {
        req.session.userType = user.userType
        req.session.userId = user._id
        req.session.username = user.username
    }
    console.log(status, message, user)
    if (status == 200) {
        return res.status(status).redirect('/')
    } else {
        return res.status(status).redirect('/login')
    }
    
}

const logoutAction = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
}

module.exports = { loginPage, loginAction, logoutAction }