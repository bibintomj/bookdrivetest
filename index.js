// Generic Imports
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");

// File Imports
const {
    insertUser,
    findUserWithLicenseNumber,
    updateCarInfoForUser,
} = require("./core/g2-test");

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

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/g2-test", (req, res) => {
    res.render("g2-test");
});

app.post("/g2-test/register", async (req, res) => {
    await insertUser(req.body);
    res.redirect("/");
});

app.get("/g-test", (req, res) => {
    res.render("g-test", { id: "", user: null, error: null });
});

app.get("/g-test/:id", async (req, res) => {
    const user = await findUserWithLicenseNumber(req.params.id);
    let error = null;
    if (user == null) {
        error = "No records found for this license number";
    }
    console.log(req.params.id, user, error);
    res.render("g-test", { id: req.params.id, user, error });
});

app.post("/g-test/update", async (req, res) => {
    const data = req.body;
    await updateCarInfoForUser(data);
    res.json({ message: "Data received successfully" });
});

app.get("/login", (req, res) => {
    res.render("login");
});
