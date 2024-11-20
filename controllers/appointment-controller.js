
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

module.exports = { 
    appointmentPage,
    createOrUpdateSlotAction,
    getAllSlots,
    getAvailableSlots,
    getAppointment
}

