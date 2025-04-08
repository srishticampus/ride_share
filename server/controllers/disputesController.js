const Disputeschema=require('../models/disputesModel')

const newDispute = (req,res)=>{
    const {reportedBy,rideId,disputeType,description}=req.body

    let Dispute = new Disputeschema({
        reportedBy,rideId,disputeType,description
    })
    Dispute.save()
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
const disputeSolve =(req,res)=>{
    let data={resolutionStatus:"Solved"}
    Disputeschema.findByIdAndUpdate(req.body.id,data,{new:true})
    .then((result) => {
        if (!result) {
            return res.status(404).json({
            error: "Dispute not found"
            });
        }
        res.status(200).json({
            data: result
        });
        })
        .catch((error) => {
        res.status(500).json({
            error: error.message
        })
    })


}

const disputeDismissed =(req,res)=>{
    let data={resolutionStatus:"Dismissed"}
    Disputeschema.findByIdAndUpdate(req.body.id,data,{new:true})
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
const showAllDisputes = (req, res) => {
    Disputeschema.find()
    .populate('reportedBy')
    .populate('rideId')

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

const showADisputes = (req, res) => {
    Disputeschema.find({_id:req.params.id})
    .populate('reportedBy')
    .populate('rideId')
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

module.exports={newDispute,disputeSolve,disputeDismissed,showAllDisputes,showADisputes}