const minimumDrivingAge = 16;
$(document).ready(() => {
    $("#firstName").focus();
    setRangesForFields();

    $("#submit").click((evt) => {
        // Personal Information
        const firstName = $("#firstName").val().trim();
        const lastName = $("#lastName").val().trim();
        const licenceNumber = $("#licenseNumber").val().trim();
        const dob = $("#dob").val().trim();

        // Car Information
        const make = $("#make").val().trim();
        const model = $("#model").val().trim();
        const year = $("#year").val().trim();
        const plateNumber = $("#plateNumber").val().trim();

        // Check validation
        const personalInfoValidationErrors = validatePersonalInfo(
            firstName,
            lastName,
            licenceNumber,
            dob
        );
        const carInfoValidationErrors = validateCarInfo(
            make,
            model,
            year,
            plateNumber
        );
        // Set error to span element
        $("#personalInfoError").html(
            `${personalInfoValidationErrors.join("<br>")}`
        );
        $("#carInfoError").html(`${carInfoValidationErrors.join("<br>")}`);

        // Prevent form submission if validation fails
        if (
            personalInfoValidationErrors.length != 0 ||
            carInfoValidationErrors.length != 0
        ) {
            evt.preventDefault();
            return;
        }
    });
});

function validatePersonalInfo(firstName, lastName, licenceNumber, dob) {
    let errors = [];
    if (firstName == "") {
        errors.push("First Name cannot be empty");
    }

    if (lastName == "") {
        errors.push("Last Name cannot be empty");
    }

    if (licenceNumber == "") {
        errors.push("Licence number cannot be empty");
    }

    if (licenceNumber.length != 8) {
        errors.push("Licence Number must be 8 characters");
    }

    let date = new Date(dob);
    const isValidDate = date instanceof Date && !isNaN(date);
    if (isValidDate) {
        date.setFullYear(date.getFullYear() + minimumDrivingAge);

        if (date > new Date()) {
            errors.push(
                "You must be atleast 16 years to apply for a driving test"
            );
        }
    } else {
        errors.push("Please enter a valid date");
    }

    return errors;
}

function validateCarInfo(make, model, year, plateNumber) {
    let errors = [];

    if (make == "") {
        errors.push("Car make cannot be empty");
    }

    if (model == "") {
        errors.push("Car model cannot be empty");
    }

    if (
        year == "" ||
        parseInt(year) > new Date().getFullYear() ||
        parseInt(year) < new Date().getFullYear() - 25
    ) {
        errors.push("Car year does not meet the minimum criteria");
    }

    if (plateNumber.length < 2 || plateNumber.length > 7) {
        errors.push("Enter a valid plate Number");
    }

    return errors;
}

function setRangesForFields() {
    // Set max date on Date of Birth.
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - minimumDrivingAge);
    let formattedDateString = maxDate.toISOString().split("T")[0];
    $("#dob").attr("max", formattedDateString);

    // Set max year for the car model
    $("#year").attr("max", new Date().getFullYear());
}
