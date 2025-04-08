const RatingSchema = require('../models/RatingModel')


const newRating=(req,res)=>{
    const {rideId,reviewerId,rating,reviewText}=req.body
    let Rating = new RatingSchema({
        rideId,reviewerId,rating,reviewText
    })
    Rating.save()
    .then((result) => {
        res.status(200).json({
            data: result
        })
    })
    .catch((error) => {
        res.status(500).json({
            error: error.message
        })
    })

}
const editRating=(req,res)=>{
    const data={rating,reviewText}=req.body
   RatingSchema.findByIdAndUpdate(req.params.id,data,{new:true})
   .then((result) => {
    res.status(200).json({
        data: result
    })
})
.catch((error) => {
    res.status(500).json({
        error: error.message
    })
})

}
const deleteRating =(req,res)=>{
    RatingSchema.findByIdAndDelete(req.params.id)
    .then((result) => {
        res.status(200).json({
            data: result
        })
    })
    .catch((error) => {
        res.status(500).json({
            error: error.message
        })
    })
    
}
const viewAllRating=(req,res)=>{
    RatingSchema.find()
    .then((result) => {
        res.status(200).json({
            data: result
        })
    })
    .catch((error) => {
        res.status(500).json({
            error: error.message
        })
    })

}
const viewARating=(req,res)=>{
    RatingSchema.findById(req.params.id)
    .then((result) => {
        res.status(200).json({
            data: result
        })
    })
    .catch((error) => {
        res.status(500).json({
            error: error.message
        })
    })

}
module.exports={newRating,editRating,deleteRating,viewARating,viewAllRating}