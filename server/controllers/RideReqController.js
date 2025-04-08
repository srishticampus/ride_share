const RideReqSchema = require('../models/RideRequestModel')

const addRideReq = (req, res) => {
    let rideReq = new RideReqSchema({
        riderId: req.body.riderId,
        driverId: req.body.driverId
    })
    rideReq.save()
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

const viewReq = (req, res) => {
    RideReqSchema.findById(req.params.id)
    .populate('riderId')
    .populate('driverId')
    .populate({
        path: 'riderId',
        populate: { path: 'userId' }
    })
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: "Ride request not found"
                })
            }
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

const allReq = (req, res) => {
    RideReqSchema.find()
    .populate('riderId')
    .populate('driverId')
    .populate({
        path: 'riderId',
        populate: { path: 'userId' }
    })
    .then((results) => {
            res.status(200).json({
                data: results
            })
        })
        .catch((error) => {
            res.status(500).json({
                error: error.message
            })
        })
}
const acceptReq=(req,res)=>{
    let data ={status:"Accepted"}
    RideReqSchema.findByIdAndUpdate(req.body.id,data,{new:true})
    .then((results) => {
        res.status(200).json({
            data: results
        })
    })
    .catch((error) => {
        res.status(500).json({
            error: error.message
        })
    })

}
const dislineReq=(req,res)=>{
    let data ={status:"Decline"}
    RideReqSchema.findByIdAndUpdate(req.body.id,data,{new:true})
    .then((results) => {
        res.status(200).json({
            data: results
        })
    })
    .catch((error) => {
        res.status(500).json({
            error: error.message
        })
    })

}
const deleteReq =(req,res)=>{
    RideReqSchema.findByIdAndDelete(req.body.id)
    .then((results) => {
        res.status(200).json({
            data: results
        })
    })
    .catch((error) => {
        res.status(500).json({
            error: error.message
        })
    })
}

const changeDriver = (req,res)=>{
    let driver ={driverId:req.body.driverId}
    RideReqSchema.findByIdAndUpdate(req.body.id,driver,{new:true})
    .then((results) => {
        res.status(200).json({
            data: results
        })
    })
    .catch((error) => {
        res.status(500).json({
            error: error.message
        })
    })

}
const viewARideRequest = (req, res) => {
    RideReqSchema.findById(req.params.id)
    .populate('driverId')
    .populate('riderId')
        .then((result) => {
            res.status(200).json({
                data: result
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error.message
            });
        });
};

module.exports = { addRideReq, viewReq,allReq,acceptReq,dislineReq,deleteReq,changeDriver,viewARideRequest}