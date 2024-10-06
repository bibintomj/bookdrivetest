const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CarDetailSchema = new Schema({
    make: String,
    model: String,
    year: Number,
    plateNumber: String,
});

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    licenseNumber: String,
    age: Number,
    carDetails: CarDetailSchema,
});

const User = mongoose.model("User", UserSchema);
// const Car = mongoose.model('Car', CarDetailSchema)

module.exports = User;
