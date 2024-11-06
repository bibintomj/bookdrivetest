"use strict";

$(document).ready(() => {
    $("#submit").click(async (evt) => {
        evt.preventDefault();

        const username = $("#username").val().trim();
        const password = $("#password").val().trim();
        const confirmPassword = $("#confirmpassword").val().trim();
        const userType = $("#userType").val()

        const validationErrors = validate(username, password, confirmPassword)

         // Set error to span element
         $("#validationError").html(
            `${validationErrors.join("<br>")}`
        );

        // Prevent form submission if validation fails
        if (validationErrors.length != 0) {
            return;
        }

        const dataToPost  = {
            username: username,
            password: password,
            userType: userType
        }

        try {
            await fetch("/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToPost),
            }).then((response) => {
                response.json().then((data) => {
                    const isError = data.status > 400
                    const message = data.message
    
                    $("#submit").html(isError ? "Failed" : "Registered");
                    $("#submit").toggleClass(isError ? "failureBackgroundColor" : "successBackgroundColor");

                    $("#validationError").html(isError ? `${message}<br>` : ``)
                    if (isError) {
                        setTimeout(function () {
                            $("#submit").html("Register");
                            $("#submit").removeClass("failureBackgroundColor");
                        }, 2000);
                    } else {
                        setTimeout(function () {
                            location.href = "/login";
                        }, 2000);
                    }
                })
            });
        } catch (error) {
            console.error(error);
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
