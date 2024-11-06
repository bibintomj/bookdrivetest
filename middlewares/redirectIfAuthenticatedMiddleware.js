
// Intended for protecting register and login routes if user if already loggedIn.
module.exports = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/')
    } else {
        next()
    }
}