require('dotenv').config();

// Generic Imports
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const expressSession = require('express-session');
const mongoose = require("mongoose");

// Controllers
const homeController = require('./controllers/home-controller')
const { g, gTestGetUser, gTestUpdateUser } = require('./controllers/g-test-controller.js')
const { g2, g2Register } = require('./controllers/g2-test-controller.js')
const { loginPage, loginAction, logoutAction } = require('./controllers/login-logout-controller.js')
const { registerPage, registerAction } = require('./controllers/register-controller.js')
const { appointmentPage, createOrUpdateSlotAction, getAllSlots, getAvailableSlots, getAppointment, candidatesPage, fetchCandidates } = require("./controllers/appointment-controller.js");
const { examinerPage, fetchAppointments, userDetails, updateCandidateStatus } = require("./controllers/examiner-controller.js");

const redirectIfAuthenticatedMiddleware = require('./middlewares/redirectIfAuthenticatedMiddleware.js')
const redirectIfUnauthenticatedMiddleware = require('./middlewares/redirectIfUnauthenticatedMiddleware.js')
const redirectIfNotDriverMiddleware = require('./middlewares/redirectIfNotDriverMiddleware.js');
const redirectIfNotAdminMiddleware = require('./middlewares/redirectIfNotAdminMiddleware.js');
const redirectIfNotExaminerMiddleware = require("./middlewares/redirectIfNotExaminerMiddleware.js");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

global.authenticatedUserType = null
global.authenticatedUserId = null
global.authenticatedUsername = null

app.use("*", (req, res, next) => {
    authenticatedUserType = req.session.userType;
    authenticatedUserId = req.session.userId;
    authenticatedUsername = req.session.username;
    next();
})

mongoose.connect(process.env.MONGO_URI,
    {
        // useNewUrlParser: true
    }
);
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("Listening to port 4000");
});

app.get("/", homeController);

app.get("/g2-test", redirectIfUnauthenticatedMiddleware, redirectIfNotDriverMiddleware, g2);

app.post("/g2-test/register", redirectIfUnauthenticatedMiddleware, redirectIfNotDriverMiddleware, g2Register);

app.get("/g-test", redirectIfUnauthenticatedMiddleware, redirectIfNotDriverMiddleware, g);

app.get("/g-test/:username", redirectIfUnauthenticatedMiddleware, redirectIfNotDriverMiddleware, gTestGetUser);

app.post("/g-test/update", redirectIfUnauthenticatedMiddleware, redirectIfNotDriverMiddleware, gTestUpdateUser);

app.get("/register", redirectIfAuthenticatedMiddleware, registerPage);

app.post("/auth/register", redirectIfAuthenticatedMiddleware, registerAction);

app.get("/login", redirectIfAuthenticatedMiddleware, loginPage);

app.post("/auth/login", redirectIfAuthenticatedMiddleware, loginAction);

app.get("/appointment", redirectIfUnauthenticatedMiddleware, redirectIfNotAdminMiddleware, appointmentPage);

app.post("/create-appointment-slot", createOrUpdateSlotAction);

app.get('/get-all-slots/:date', getAllSlots);

app.get('/get-available-slots/:date', getAvailableSlots);

app.get('/get-appointment/:appointmentId', getAppointment);

app.get("/candidates", redirectIfUnauthenticatedMiddleware, redirectIfNotAdminMiddleware, candidatesPage);

app.get("/api/candidates", redirectIfUnauthenticatedMiddleware, redirectIfNotAdminMiddleware, fetchCandidates);

app.get('/examiner', redirectIfNotExaminerMiddleware, examinerPage)

app.get('/examiner/appointments', redirectIfNotExaminerMiddleware, fetchAppointments)

app.get('/examiner/user-details/:id', redirectIfNotExaminerMiddleware, userDetails)

app.post('/examiner/update-status', redirectIfNotExaminerMiddleware, updateCandidateStatus);

app.get("/logout", logoutAction);

module.exports = app;