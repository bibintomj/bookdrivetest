const User = require("../models/User");

const examinerPage = async (req, res) => {
    try {
        const appointments = await User.find({ appointmentId: { $exists: true } })
            .populate("appointmentId")
            .select("firstName lastName testType comments testStatus licenseNumber carDetails");
        res.render("examiner", { appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).send("Internal Server Error");
    }
};

const fetchAppointments = async (req, res) => {
    try {
        const { testType } = req.query;
        const filter = testType && testType !== "all" ? { testType } : {};
        const appointments = await User.find({ ...filter, appointmentId: { $exists: true } })
            .populate("appointmentId")
            .select("firstName lastName testType comments testStatus licenseNumber carDetails");
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching filtered appointments:", error);
        res.status(500).send("Internal Server Error");
    }
};

const userDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("firstName lastName testType comments testStatus licenseNumber carDetails");
        res.json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).send("Internal Server Error");
    }
}

const updateCandidateStatus = async (req, res) => {
    try {
        const { userId, status, comments } = req.body;

        // Update the candidate's status and comments
        await User.findByIdAndUpdate(userId, {
            appointmentId: null,
            testStatus: status,
            comments: comments || '',
        });

        res.status(200).send("Status updated successfully");
    } catch (error) {
        console.error("Error updating candidate status:", error);
        res.status(500).send("Internal Server Error");
    }
};


module.exports = {
    examinerPage,
    fetchAppointments,
    userDetails,
    updateCandidateStatus
};
