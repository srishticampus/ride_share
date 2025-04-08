const VehicleSchema = require('../models/vehicleModel'); 

const AddVehicleDtl=(req,res)=>{
    const {vehicleRegistrationNo,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vehicleType,
        vehicleCapacity,
        vehicleFuelType,
        driverId,
        insuranceStatus}=req.body
    let Vehicle= new VehicleSchema({
        vehicleRegistrationNo,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vehicleType,
        vehicleCapacity,
        vehicleFuelType,
        driverId,
        insuranceStatus
    })
    Vehicle.save()
   
        .then((result) => {
            res.status(200).json({
                data: result,
                message: "Vehicle details added successfully"
            });
        })
        .catch((error) => {
            console.error(error); 
            res.status(500).json({
                error: "Failed to add vehicle details. Please try again later."
            });
        });
}

const updateDetails = (req,res)=>{
    const {
        vehicleRegistrationNo,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vehicleType,
        vehicleCapacity,
        vehicleFuelType,
        insuranceStatus
    } = req.body;

    const data = {
        vehicleRegistrationNo,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vehicleType,
        vehicleCapacity,
        vehicleFuelType,
        insuranceStatus
    };
        VehicleSchema.findByIdAndUpdate(req.params.id,data,{new:true})
        .then((result) => {
            res.status(200).json({
                data: result,
            });
        })
        .catch((error) => {
            console.error(error); 
            res.status(500).json({
                error: "Failed to add vehicle update details. Please try again later."
            });
        });

}
const ShowAllVehicle=(req,res)=>{
    VehicleSchema.find()
    .populate('driverId')
    .then((result) => {
        res.status(200).json({
            data: result,
        });
    })
    .catch((error) => {
        console.error(error); 
        res.status(500).json({
            error: error.message
        });
    });
}

const ShowAVehicle=(req,res)=>{
    VehicleSchema.findById(req.params.id)
    .populate('driverId')
    .then((result) => {
        res.status(200).json({
            data: result,
        });
    })
    .catch((error) => {
        console.error(error); 
        res.status(500).json({
            error: error.message
        });
    });
}

module.exports={AddVehicleDtl,updateDetails,ShowAllVehicle,ShowAVehicle}