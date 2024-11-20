
module.exports = (req, res, next) => {
    if (req.session.userType == 'admin') {
        next()
    } else {
        return res.redirect('/')
    }
}