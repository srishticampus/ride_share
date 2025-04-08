const mongoose = require("mongoose")

const DriverSchema = mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    driverPic: {
        type: Object
    },
    licenseNumber: {
        type: String,
        required: true
    },

    backgroundCheck: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicles"
    },
    driverRating: {
        type: Number
    },
    createdAt: {
        type: Date,
    }

},{ timestamps: true });
module.exports = mongoose.model('drivers', DriverSchema)