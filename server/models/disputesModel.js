const mongoose = require("mongoose")

const Disputeschema = mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "rides"
    },
    disputeType: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    resolutionStatus: {
        type: String,
        default:"Pending",
        enum: ["Pending", "Resolved", "Rejected"]

    },
    createdAt: {
        type: Date
    },
    resolutionAt: {
        type: Date
    }

});
module.exports = mongoose.model('disputes', Disputeschema)