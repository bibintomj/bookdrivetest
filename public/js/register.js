"use strict";

$(document).ready(() => {
    $("#submit").click((evt) => {
        const username = $("#username").val().trim();
        const password = $("#password").val().trim();
        const confirmPassword = $("#confirmpassword").val().trim();

        const validationErrors = validate(username, password, confirmPassword)

         // Set error to span element
         $("#validationError").html(
            `${validationErrors.join("<br>")}`
        );

        // Prevent form submission if validation fails
        if (validationErrors.length != 0) {
            evt.preventDefault();
            return;
        }
    });
});

function validate(userName, password, confirmPassword) {
    let errors = [];
    if (userName == "") {
        errors.push("Username cannot be empty");
    }

    errors = errors.concat(passwordStrategies
        .filter((strategy) => !strategy.validate(password))
        .map((strategy) => strategy.message));

    if (password != confirmPassword) {
        errors.push("Confirm password should match");
    }

    return errors;
}

const passwordStrategies = [
    {
        validate: (password) => password.length >= 8,
        message: "Password must be at least 8 characters long.",
    },
    {
        validate: (password) => /[A-Z]/.test(password),
        message: "Password must contain at least one uppercase letter.",
    },
    {
        validate: (password) => /[a-z]/.test(password),
        message: "Password must contain at least one lowercase letter.",
    },
    {
        validate: (password) => /[0-9]/.test(password),
        message: "Password must contain at least one number.",
    },
    {
        validate: (password) => /[\W_]/.test(password),
        message: "Password must contain at least one special character.",
    },
];
