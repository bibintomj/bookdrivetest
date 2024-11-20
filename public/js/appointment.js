let selectedSlots = []; // Array to store selected slots as objects

$(document).ready(function () {
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

    renderCalendar(currentMonth, currentYear);
});

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

function updateCreateButton() {
    const $createButton = $("#create-slots-btn");

    if (selectedSlots.length > 0) {
        $createButton
            .text(`Create ${selectedSlots.length} Slots`)
            .show();
    } else {
        $createButton.hide();
    }
}

function handleSlotToggle(date, time) {
    const slot = { date, time, isTimeSlotAvailable: true };
    const index = selectedSlots.findIndex(
        (s) => s.date === slot.date && s.time === slot.time
    );

    if (index > -1) {
        // Slot is already selected, deselect it
        selectedSlots.splice(index, 1);
    } else {
        // Slot is not selected, add it
        selectedSlots.push(slot);
    }

    updateCreateButton();
}

async function renderSlots(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);

    const startTime = 9 * 60; // 9:00 AM in minutes
    const endTime = 14 * 60; // 2:00 PM in minutes
    const interval = 30; // 30 minutes
    const slots = generateTimeSlots(startTime, endTime, interval);

    const $slotsContainer = $("#slots-container");
    const $contentContainer = $("#selected-date-appointment-content");
    const $selectedDate = $("#selected-date");

    $selectedDate.text(formattedDate);
    $slotsContainer.empty();
    selectedSlots = [];
    updateCreateButton();

    try {
        // Fetch existing slots from backend
        const response = await fetch(`/get-all-slots/${formatDate(date)}`);
        const data = await response.json();

        const existingSlots = data.slots.map(slot => slot.time);

        // Add new slots with disabled ones
        if (slots.length > 0) {
            $.each(slots, function (index, slot) {
                const isDisabled = existingSlots.includes(slot); // Check if slot is already added

                const $slotDiv = $("<div>")
                    .addClass("slot")
                    .text(slot)
                    .toggleClass("disabled", isDisabled) // Add disabled class
                    .on("click", function () {
                        if (!isDisabled) {
                            $(this).toggleClass("selected");
                            handleSlotToggle(formatDate(date), slot);
                        }
                    });

                $slotsContainer.append($slotDiv);
            });
            $contentContainer.show();
        } else {
            $contentContainer.hide();
        }
    } catch (error) {
        console.error('Error fetching existing slots:', error);
    }
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


function createSlots(selectedSlots) {
    // Make the POST request
    fetch("/create-appointment-slot", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ slots: selectedSlots }), // Send selected slots
    })
        .then((response) => {
            if (response.ok) {
                window.location.href = "/appointment";
            } else {
                console.error("Error creating appointment slots:", response.statusText);
            }
        })
        .catch((error) => {
            console.error("Network error:", error);
        });
}

// Handle "Create Slots" button click
$("#create-slots-btn").on("click", function () {
    createSlots(selectedSlots); // Send selected slots to backend
});
