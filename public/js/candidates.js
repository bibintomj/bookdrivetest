$(document).ready(function () {
    const loadCandidates = () => {
        $.get("/api/candidates", function (candidates) {
            const $tableBody = $("#candidates-table tbody");
            $tableBody.empty();

            if (candidates.length === 0) {
                $tableBody.append("<tr><td colspan='4'>No candidates found</td></tr>");
                return;
            }

            candidates.forEach((candidate) => {
                const { _id, firstName, lastName, testType, testStatus, comments } = candidate;
                const statusText = testStatus === 'decision pending' ? 'Decision Pending' : testStatus === 'pass' ? 'Passed' : 'Failed';
                const row = `
                    <tr data-id="${_id}">
                        <td>${firstName} ${lastName}</td>
                        <td>${testType}</td>
                        <td>${statusText}</td>
                        <td>${comments || 'No comments'}</td>
                    </tr>
                `;
                $tableBody.append(row);
            });
        }).fail(function () {
            alert("Error loading candidates.");
        });
    };

    // Load candidates on page load
    loadCandidates();
});