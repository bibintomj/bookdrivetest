// Generic Imports
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");

// Controllers
const homeController = require('./controllers/home-controller')
const { g, gTestGetUser, gTestUpdateUser } = require('./controllers/g-test-controller.js')
const { g2, g2Register } = require('./controllers/g2-test-controller.js')
const { loginPage, loginAction } = require('./controllers/login-controller.js')
const { registerPage, registerAction } = require('./controllers/register-controller.js')

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
    "mongodb+srv://bibintomj:h3lJXs1UcQmeZghr@cluster0.hwrhl.mongodb.net/bookdrivetest?retryWrites=true&w=majority&appName=Cluster0",
    {
        // useNewUrlParser: true
    }
);

app.listen(3000, () => {
    console.log("Listening to port 3000");
});

app.get("/", homeController);

app.get("/g2-test", g2);

app.post("/g2-test/register", g2Register);

app.get("/g-test", g);

app.get("/g-test/:id", gTestGetUser);

app.post("/g-test/update", gTestUpdateUser);

app.get("/register", registerPage);

app.post("/auth/register", registerAction);

app.get("/login", loginPage);

app.post("/auth/login", loginAction);
