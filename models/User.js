const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const UserType = require('../enums/userTypeEnum')

const CarDetailSchema = new Schema({
    make: {
        type: String,
        default: ''
    },
    model: {
        type: String,
        default: ''
    },
    year: {
        type: Number,
        default: 0
    },
    plateNumber: {
        type: String,
        default: ''
    },
});

const UserSchema = new Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    licenseNumber: {
        type: String,
        default: ''
    },
    age: {
        type: Number,
        default: 0
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: Object.values(UserType),
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
    },
    carDetails: CarDetailSchema,
});

// I learned the hard way that this cannot be an arrow function. 
// Arrow functions does not have their own 'this' context, 
// instead they inherit it from surrounding context.
UserSchema.pre("save", async function (next) {
    const user = this
    if (user.isModified('password')) {
        const hash = await bcrypt.hash(this.password, 10);
        user.password = hash
    }
    
    next();
});

UserSchema.pre("updateOne", async function (next) {
    const update = this.getUpdate();

    // Check if licenseNumber is being updated
    if (update.licenseNumber) {
        const hash = await bcrypt.hash(update.licenseNumber, 10);
        update.licenseNumber = hash;
    }

    next();
});


const User = mongoose.model("User", UserSchema);

module.exports = User;
