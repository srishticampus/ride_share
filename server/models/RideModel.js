const mongoose = require("mongoose")

const Rideschema = mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "drivers"
    },
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "profiles"
    },
    origin: {
        type: String,
        required: true
    },
    distination: {
        type: String,
        required: true
    },
    rideDate: {
        type: Date,
        required: true
    },
    rideTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default:"Pending",
        enum: ["Pending", "Accepted", "Cancelled"]
    },
    price: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date
    }

}, {timestamps: true});
module.exports = mongoose.model('rides', Rideschema)