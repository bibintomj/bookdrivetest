const minimumDrivingAge = 16;
$(document).ready(async () => {
    $("#firstName").focus();
    showUserDataIfExists();
    await setupCalendar();
    $("#submit").click((evt) => {
        // Personal Information
        const firstName = $("#firstName").val().trim();
        const lastName = $("#lastName").val().trim();
        const licenceNumber = $("#licenseNumber").val().trim();
        const age = $("#age").val().trim();

        // Car Information
        const make = $("#make").val().trim();
        const model = $("#model").val().trim();
        const year = $("#year").val().trim();
        const plateNumber = $("#plateNumber").val().trim();
        const testType = "G2";

        // Check validation
        const personalInfoValidationErrors = validatePersonalInfo(
            firstName,
            lastName,
            licenceNumber,
            age
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

function validatePersonalInfo(firstName, lastName, licenceNumber, age) {
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

        $('html, body').animate({
            scrollTop: $('#licenseNumber').offset().top
        }, 500); // Scroll duration in milliseconds
    }

    if (age < minimumDrivingAge) {
        errors.push("You must be atleast 16 years to apply for a driving test");
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

function showUserDataIfExists() {
    if (!userData.licenseNumber) {
        return
    }

    $("#firstName").val(userData.firstName);
    $("#lastName").val(userData.lastName);
    // $("#licenseNumber").removeAttr('maxlength')
    $("#licenseNumber").val(userData.licenseNumber);
    $("#age").val(userData.age);

    // Car Information
    $("#make").val(userData.carDetails.make);
    $("#model").val(userData.carDetails.model);
    $("#year").val(userData.carDetails.year);
    $("#plateNumber").val(userData.carDetails.plateNumber);
}

let selectedSlot = null; // To store selected slot as object

async function setupCalendar() {

    if (userData.appointmentId) {
        // If appointment exist, then no need to show the a calender
        await hideCalendarAndShowAppointment()
        return
    }

    $('#booked-appointment-details-view').hide()

    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const today = new Date();
    let selectedDate = today;
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function renderCalendar(month, year) {
        const firstDay = new Date(year, month).getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const $calendarDate = $(".calendar__date");
        $calendarDate.empty();

        // Add days of the week
        daysOfWeek.forEach((day) => {
            $calendarDate.append(`<div class="calendar__day">${day}</div>`);
        });

        // Add blank spaces before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            $calendarDate.append(`<div class="calendar__number"></div>`);
        }

        // Add days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today;

            let classes = "calendar__number";
            if (isToday) classes += " calendar__number--current";
            if (isPast) classes += " calendar__number--disabled";

            $calendarDate.append(
                `<div class="${classes}" data-date="${date}">
                    ${day}
                </div>`
            );
        }

        // Update title and subtitle
        $(".calendar__title").text(
            `${new Date(year, month).toLocaleString("default", {
                month: "long",
            })} ${year}`
        );
    }

    function handleDateClick(event) {
        const $target = $(event.target);
        if ($target.hasClass("calendar__number--disabled")) return;

        $(".calendar__number").removeClass("calendar__number--selected");
        $target.addClass("calendar__number--selected");

        selectedDate = new Date($target.data("date"));
        selectedSlot = null;
        renderSlots(selectedDate);
    }

    $(".calendar__date").on("click", ".calendar__number", handleDateClick);

    $(".calendar__nav--prev").click(function () {
        currentMonth -= 1;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear -= 1;
        }
        renderCalendar(currentMonth, currentYear);
    });

    $(".calendar__nav--next").click(function () {
        currentMonth += 1;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear += 1;
        }
        renderCalendar(currentMonth, currentYear);
    });

    $("#selected-date-no-content").hide();

    renderCalendar(currentMonth, currentYear);
}

async function hideCalendarAndShowAppointment() {
    $('#appointment-content-view').hide(); // Hide the calendar view

    if (userData.testStatus !== "decision pending") {
        // If the test is completed (pass or fail), show the result
        $('#test-status-view').show();
        $('#booked-appointment-details-view').hide();
    } else {
        // Show appointment details
        $('#booked-appointment-details-view').show();
        try {
            // Fetch the appointment details from the backend using the appointment ID
            const response = await fetch(`/get-appointment/${userData.appointmentId}`);
            const appointment = await response.json();

            if (appointment && appointment.date && appointment.time) {
                // Set the appointment details in the frontend
                $('#booked-appointment-date-time').text(`${appointment.date} at ${appointment.time}`); // Set the date
            } else {
                console.log('No appointment found');
            }
        } catch (error) {
            console.error('Error fetching appointment details:', error);
        }
    }
}

function generateTimeSlots(startTime, endTime, intervalMinutes) {
    const slots = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
        const hours = Math.floor(currentTime / 60);
        const minutes = currentTime % 60;
        const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;
        slots.push(formattedTime);
        currentTime += intervalMinutes;
    }
    return slots;
}


function handleSlotToggle(slot) {
    if (selectedSlot && selectedSlot.date === slot.date && selectedSlot.time === slot.time) {
        // If the selected slot is clicked again, deselect it
        selectedSlot = null;
    } else {
        // Select the new slot
        selectedSlot = slot;
    }

    // Update the UI to reflect the current selection state
    $(".slot").removeClass("selected"); // Remove the selected class from all slots
    if (selectedSlot) {
        // If a slot is selected, add the selected class to it
        $(`.slot:contains(${slot.time})`).addClass("selected");
    }
    $("#appointmentId").val(selectedSlot._id);
}

async function renderSlots(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);

    const $slotsContainer = $("#slots-container");
    const $contentContainer = $("#selected-date-appointment-content");
    const $selectedDate = $("#selected-date");

    $selectedDate.text(formattedDate);
    $slotsContainer.empty();

    try {
        // Fetch available slots from backend
        const response = await fetch(`/get-available-slots/${formatDate(date)}`);
        const data = await response.json();

        console.log(data);

        if (data.slots && data.slots.length > 0) {
            // Render only the available slots
            $.each(data.slots, function (index, slot) {
                const $slotDiv = $("<div>")
                    .addClass("slot")
                    .text(slot.time) // Display the time of the slot
                    .on("click", function () {
                        // $(this).toggleClass("selected");
                        handleSlotToggle(slot);
                    });

                $slotsContainer.append($slotDiv);
            });
            $contentContainer.show();
            $("#selected-date-no-content").hide();
        } else {
            // Hide content if no slots are available
            $contentContainer.hide();
            $("#selected-date-no-content").show();
        }
    } catch (error) {
        console.error('Error fetching available slots:', error);
    }
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
