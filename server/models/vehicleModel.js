const mongoose = require("mongoose")

const Vehicleschema = mongoose.Schema({
    vehicleRegistrationNo: {
        type: String,
        required: true
    },
    vehicleMake: {
        type: String,
        required: true
    },
    vehicleModel: {
        type: String,
        required: true
    },
    vehicleYear: {
        type: Number,
        required: true
    },
    vehicleColor: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    vehicleCapacity: {
        type: Number,
        required: true
    },
    vehicleFuelType: {
        type: String,
        required: true
    },
    insuranceStatus: {
        type: Boolean,
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "drivers"
    },
    createdAt: {
        type: Date
    }

}, { timestamps: true });
module.exports = mongoose.model('vehicles', Vehicleschema)