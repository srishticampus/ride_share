const mongoose=require("mongoose")

const RatingSchema = mongoose.Schema({
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "rides"
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        trim: true,
        maxlength: 500
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
},{timestamps: true});
module.exports=mongoose.model('rating',RatingSchema)