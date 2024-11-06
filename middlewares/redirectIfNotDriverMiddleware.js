
module.exports = (req, res, next) => {
    if (req.session.userType == 'driver') {
        next()
    } else {
        return res.redirect('/')
    }
}