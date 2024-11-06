$(document).ready(() => {
    $("#submit").click((evt) => {
        const id = $("#licenseNumber").val().trim();
        if (id == "") {
            $("#validationError").text("Please enter a valid License Number");
        } else {
            location.replace(`/g-test/${id}`);
        }
        evt.preventDefault();
    });

    $("#updateCarInfoButton").click(async (evt) => {
        evt.preventDefault();
        const userData = JSON.parse($("#userData").attr("data-user"));

        const isDisabledMode =
            $("#make").prop("disabled") &&
            $("#model").prop("disabled") &&
            $("#year").prop("disabled") &&
            $("#plateNumber").prop("disabled");
        if (isDisabledMode) {
            makeFormEditable();
        } else {
            validateAndSave();
        }
    });
});

function makeFormEditable() {
    // Remove disabled property so that user can type in the data
    $("#make").prop("disabled", false);
    $("#model").prop("disabled", false);
    $("#year").prop("disabled", false);
    $("#plateNumber").prop("disabled", false);

    // disabledInput reduces the opacity of the element to give a disabled look and feel
    $("#make").toggleClass("disabledInput");
    $("#model").toggleClass("disabledInput");
    $("#year").toggleClass("disabledInput");
    $("#plateNumber").toggleClass("disabledInput");

    // Update the button text to 'Save'
    $("#updateCarInfoButton").html("Save");
    $("#make").focus();
    $("#make").select();
}

async function validateAndSave() {
    // Validation
    const make = $("#make").val().trim();
    const model = $("#model").val().trim();
    const year = $("#year").val().trim();
    const plateNumber = $("#plateNumber").val().trim();
    const carInfoValidationErrors = validateCarInfo(
        make,
        model,
        year,
        plateNumber
    );
    $("#carInfoError").html(`${carInfoValidationErrors.join("<br>")}`);
    if (carInfoValidationErrors.length != 0) {
        // Return if validation fails
        return;
    }
    // Disable controls while saving
    $("#make").prop("disabled", true);
    $("#model").prop("disabled", true);
    $("#year").prop("disabled", true);
    $("#plateNumber").prop("disabled", true);
    $("#updateCarInfoButton").prop("disabled", true);
    // post data to backend
    const dataToPost = {
        id: userData._id,
        licenseNumber: userData.licenseNumber,
        carDetails: {
            make: make,
            model: model,
            year: year,
            plateNumber: plateNumber,
        },
    };

    try {
        await fetch("/g-test/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToPost),
        }).then((response) => {
            $("#updateCarInfoButton").html("Updated");
            $("#updateCarInfoButton").toggleClass("successBackgroundColor");
            setTimeout(function () {
                location.replace("/g-test/" + userData.username);
            }, 2000);
        });
    } catch (error) {
        console.error(error);
    }
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
