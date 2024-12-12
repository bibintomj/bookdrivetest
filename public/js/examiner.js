$(document).ready(function () {
    const loadAppointments = (filter = "all") => {
        $.get(`/examiner/appointments?testType=${filter}`, function (appointments) {
            const $tableBody = $("#appointments-table tbody");
            $tableBody.empty();

            if (appointments.length === 0) {
                $tableBody.append("<tr><td colspan='5'>No appointments found</td></tr>");
                return;
            }

            appointments.forEach((appointment) => {
                const { _id, firstName, lastName, testType, carDetails, testStatus } = appointment;
                
                const statusText = testStatus === 'decision pending' ? 'Decision Pending' : testStatus === 'pass' ? 'Passed' : 'Failed';
                const statusColor = testStatus === 'decision pending' ? 'foregroundColor' : testStatus === 'pass' ? 'successGreen' : 'errorLabelColor';
                const row = `
                    <tr data-id="${_id}">
                        <td>${firstName} ${lastName}</td>
                        <td>${testType}</td>
                        <td>${carDetails.make}</td>
                        <td>${carDetails.model}</td>
                        <td style="color: var(--${statusColor});">${statusText}</td>
                        <td><button class="view-details-btn" data-id="${_id}">View Details</button></td>
                    </tr>
                `;
                $tableBody.append(row);
            });
            
        });
    };

    // Load appointments on page load
    loadAppointments();

    // Filter change event
    $("#test-type-filter").change(function () {
        const filter = $(this).val();
        loadAppointments(filter);
    });

    // Handle View Details button click
    $(document).on("click", ".view-details-btn", function () {
        const userId = $(this).data("id");
        $.get(`/examiner/user-details/${userId}`, function (user) {
            $("#driver-name").text(`${user.firstName} ${user.lastName}`);
            $("#driver-car-make").text(user.carDetails.make);
            $("#driver-car-model").text(user.carDetails.model);
            $("#driver-car-year").text(user.carDetails.year);
    
            // Show existing comments
            $("#comments").val(user.comments || "").prop("disabled", user.testStatus !== "decision pending");
    
            // Show status and adjust UI
            const statusText = user.testStatus === 'decision pending' ? 'Decision Pending' : user.testStatus === 'pass' ? 'Passed' : 'Failed';
            $("#status-display").text(`Status: ${statusText}`);
            $("#status-display").show();
    
            if (user.testStatus !== "decision pending") {
                $("#examiner-action-buttons-container").hide(); // Remove buttons
            } else {
                $("#examiner-action-buttons-container").show(); // Show buttons if decision pending
            }
    
            $("#driver-details").data("id", userId).show(); // Set user ID and show details
        });
    });

    // Handle Close Details button click
    $("#close-details-btn").click(function () {
        $("#driver-details").hide();
    });

    $("#pass-btn").click(function () {
        const userId = $("#driver-details").data("id");
        updateCandidateStatus(userId, "pass");
    });
    
    // Handle Fail button click
    $("#fail-btn").click(function () {
        const userId = $("#driver-details").data("id");
        updateCandidateStatus(userId, "fail");
    });
});


// Update Candidate Status Function
const updateCandidateStatus = (userId, status) => {
    const comments = $("#comments").val();
    $.post("/examiner/update-status", { userId, status, comments }, function () {
        alert(`Candidate marked as ${status}.`);
        location.reload(); // Refresh the page to reflect the changes
    }).fail(function () {
        alert("Error updating candidate status.");
    });
};