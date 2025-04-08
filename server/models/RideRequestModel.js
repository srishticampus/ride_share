const mongoose = require("mongoose")

const RideRequestSchema = mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "drivers"
    },
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profiles"
    },
    requestTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true });
module.exports = mongoose.model('ridereq', RideRequestSchema)