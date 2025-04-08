const Profileschema = require('../models/ProfilesModel')

const setProfile =(req,res)=>{
    const {
        userId,
        commuteStart,
        commuteEnd,
        workStartTime,
        wordEndTime,
        vehicleDetails,
    } = req.body;

    const Profile = new Profileschema({
        userId,
        commuteStart,
        commuteEnd,
        workStartTime,
        wordEndTime,
        vehicleDetails,
    });

    Profile.save()

    .then(result => {
        res.status(201).json(result);
    })
    .catch(error => {
        console.error(error); 
        res.status(500).json({
            error: "Failed"
        });
    });
}

const editProfile=(req,res)=>{
    let data ={
        commuteStart,
        commuteEnd,
        workStartTime,
        wordEndTime,
    }=req.body
    Profileschema.findByIdAndUpdate(req.body.id,data,{new:true})
    .then(result => {
        res.status(201).json(result);
    })
.catch(error => {
    console.error(error); 
    res.status(500).json({
        error: "Failed"
    });
});
}
const ShowAllProfiles=(req,res)=>{
    Profileschema.find()
    .populate('userId')
    .populate('vehicleDetails')
    .populate({
        path: 'vehicleDetails',
        populate: { path: 'driverId' }
    })
    .then(result => {
        res.status(201).json(result);
    })
.catch(error => {
    console.error(error); 
    res.status(500).json({
        error: "Failed"
    });
});

}

const aProfile=(req,res)=>{
    Profileschema.findOne({_id:req.params.id})
    .populate('userId')
    .populate('vehicleDetails')
    .populate({
        path: 'vehicleDetails',
        populate: { path: 'driverId' }
    })
    .then(result => {
        res.status(201).json(result);
    })
.catch(error => {
    console.error(error); 
    res.status(500).json({
        error: "Failed"
    });
});

}

module.exports = { setProfile, editProfile,ShowAllProfiles,aProfile };