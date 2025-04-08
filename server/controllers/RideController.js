const RideSchema = require('../models/RideModel')

const newRide = (req, res) => {
    const {
        driverId,
        riderId,
        origin,
        distination,
        rideDate,
        rideTime,
        price,
        status
    } = req.body;
    let ride = new RideSchema({
        driverId,
        riderId,
        origin,
        distination,
        rideDate,
        rideTime,
        price,
        status
    });
    ride.save()
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

const showAllRides = (req, res) => {
    RideSchema.find()
    .populate('driverId')
    .populate('riderId')

        .then((rides) => {
            res.status(200).json({
                data: rides
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error.message
            });
        });
};

const viewAride=(req,res)=>{
    RideSchema.findById(req.params.id)
    .populate('driverId')
    .populate('riderId')

    .then((rides) => {
        res.status(200).json({
            data: rides
        });
    })
    .catch((error) => {
        res.status(500).json({
            error: error.message
        });
    });

}

module.exports = { newRide, showAllRides,viewAride,showAllRides };
