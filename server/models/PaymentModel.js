const mongoose = require("mongoose")

const Paymentschema = mongoose.Schema({
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Ride ID is required"],
        ref: "rides"
    },
    payerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Payer ID is required"],
        ref: "users"
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be a positive number"]
    },
    paymentStatus: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Completed", "Failed"]
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
        enum: ["Cash","Online Payment"]
    }
}, { timestamps: true });
module.exports = mongoose.model('payments', Paymentschema)