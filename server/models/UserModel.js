const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    profilePicture: {
        type: Object,
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    commuteStatus:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });  

module.exports = mongoose.model('users', UserSchema);
