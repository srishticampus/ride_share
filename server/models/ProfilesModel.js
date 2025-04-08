const mongoose = require("mongoose")

const Profileschema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "users"
    },
    commuteStart: {
        type: String,
        required: true
    },
    commuteEnd: {
        type: String,
        required: true
    },
    workStartTime: {
        type: String,
        required: true
    },
    wordEndTime: {
        type: String,
        required: true
    },
    vehicleDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "vehicles"
    },
    // createdAt: {
    //     type: Date,
    // }

},{timestamps: true});
module.exports = mongoose.model('profiles', Profileschema)