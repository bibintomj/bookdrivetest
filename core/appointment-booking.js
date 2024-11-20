const mongoose = require("mongoose");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

async function createOrUpdateSlot(date, time, available) {
    try {
        const existingAppointmentSlot = await Appointment.findOne({ date, time });

        if (existingAppointmentSlot) {
            await Appointment.findByIdAndUpdate(existingAppointmentSlot._id, {
                isTimeSlotAvailable: available
            })
        } else {
            const newAppointmentSlot = new TimeSlot({
                date: date,
                time: time,
                isTimeSlotAvailable: available
            });
            await Appointment.create(newAppointmentSlot)
        }
    } catch (error) {
        console.log("Failed to Create or update ", error)
    }
}

async function createOrUpdateSlots(slots) {
    try {
        const bulkOperations = slots.map((slot) => ({
            updateOne: {
                filter: { date: slot.date, time: slot.time },
                update: { $set: { isTimeSlotAvailable: slot.isTimeSlotAvailable } },
                upsert: true, // Insert a new document if no match is found
            },
        }));

        // Execute the bulk write operation
        const result = await Appointment.bulkWrite(bulkOperations);

        console.log('Bulk write result:', result);
    } catch (error) {
        console.error('Failed to create or update slots:', error);
    }
}

async function getAllSlotsForDate(date) {
    console.log("Fetching ", date)
    try {
        const slots = await Appointment.find({ date }); // Retrieve all slots for the given date
        console.log("GOT SlOTS", slots)

        return slots
    } catch (error) {
        console.error('Error fetching slots:', error);
        return []
    }
}

async function getSlotsWithFilter(filter) {
    try {
        return await Appointment.find(filter); // Fetch available slots
    } catch (error) {
        console.error('Error fetching available slots:', error);
        return []
    }
}

async function getAppointmentWithId(appointmentId) {
    try {
        return await Appointment.findById(appointmentId);
    } catch (error) {
        console.log("Failed to fetch appointment", error)
        return null
    }
}

module.exports = {
    createOrUpdateSlot,
    createOrUpdateSlots,
    getAllSlotsForDate,
    getSlotsWithFilter,
    getAppointmentWithId
}