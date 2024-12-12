
module.exports = (req, res, next) => {
    if (req.session.userType == 'examiner') {
        next()
    } else {
        return res.redirect('/')
    }
}