const User = require("../models/User");
const {
    createOrUpdateSlot,
    createOrUpdateSlots,
    getAllSlotsForDate,
    getSlotsWithFilter,
    getAppointmentWithId
} = require("../core/appointment-booking");

const appointmentPage = (req, res) => {
    res.render("appointment");
}

const createOrUpdateSlotAction = async (req, res) => {
    // Get the data from frontend as an array. 
    await createOrUpdateSlots(req.body.slots);
    res.redirect("/appointment")
}

const getAllSlots =  async (req, res) => {
    const slots = await getAllSlotsForDate(req.params.date);
    res.status(200).json({ slots });
}

const getAvailableSlots = async (req, res) => {
    const slots = await getSlotsWithFilter({ date: req.params.date, isTimeSlotAvailable: true })
    res.json({ slots });
}

const getAppointment = async (req, res) => {
    const appointmentId = req.params.appointmentId;
    if (appointmentId == null || appointmentId == "null") {
        res.status(404).send('Appointment not found');
        return
    }
    const appointment = await getAppointmentWithId(appointmentId);
    if (appointment) {
        res.json({
            date: appointment.date,
            time: appointment.time,
        });
    } else {
        res.status(404).send('Appointment not found');
    }
}

const candidatesPage = async (req, res) => {
    try {
        res.render("candidates"); // No need to pass `candidates` here
    } catch (error) {
        console.error("Error rendering candidates page:", error);
        res.status(500).send("Internal Server Error");
    }
};

const fetchCandidates = async (req, res) => {
    try {
        // Fetch candidates with appointments
        const candidates = await User.find({ appointmentId: { $exists: true } })
            .populate("appointmentId")
            .select("firstName lastName testType testStatus comments");
        res.json(candidates); // Send JSON response
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { 
    appointmentPage,
    createOrUpdateSlotAction,
    getAllSlots,
    getAvailableSlots,
    getAppointment,
    candidatesPage,
    fetchCandidates
}

