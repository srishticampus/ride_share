const DriverSchema = require('../models/driverModel')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage }).single('driverPic')

const DriverRegistration = (req, res) => {
    const { phoneNumber, password, licenseNumber } = req.body
    let Driver = new DriverSchema({
        phoneNumber,
        password,
        licenseNumber,
        driverPic: req.file 
    })

    Driver.save()
        .then((result) => {
            res.status(200).json({
                data: result
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error saving driver",
                error: error.message
            })
        })
}

const login = (req, res) => {
    const { phoneNumber, password } = req.body

    DriverSchema.findOne({ phoneNumber }).then(user => {
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }

        if (user.password !== password) {
            return res.status(403).json({ msg: 'Password Mismatch !!' })
        }

        if (!user.backgroundCheck) {
            return res.status(403).json({ msg: 'Please wait for Admin Approval !!' })
        }
        if (!user.status) {
            return res.status(403).json({ msg: 'You are currently deactivated By Admin !!' })
        }

        res.json({
            status: 200,
            data: user,
        })
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ msg: 'Something went wrong' })
    })
}

    const ForgotPassword = (req, res) => {
        DriverSchema.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, { password: req.body.password }, { new: true })
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        message: "Spotted User",
                        data: result,
                    });
                } else {
                    res.status(401).json({ message: "Invalid Userid" });
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    


const EditProfile = (req,res)=>{
    const data={
        phoneNumber:req.body.phoneNumber,
        licenseNumber:req.body.licenseNumber,
        driverPic:req.file ? req.file.path : null
    }
    DriverSchema.findByIdAndUpdate(req.body.id, data, { new: true })
    .then((result) => {
        res.status(200).json({
            data: result
        })
    })
    .catch((error) => {
        res.status(500).json({
            message: "Error on editing driver",
            error: error.message
        })
    })
}
const ApproveDriver = ((req, res) => {
    DriverSchema.findByIdAndUpdate(req.body.id, { backgroundCheck: true },{new:true})
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
})

const DeactivateDriver = ((req, res) => {
    DriverSchema.findByIdAndUpdate(req.body.id, { status: false },{new:true})
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
})

const ActivateDriver = ((req, res) => {
    DriverSchema.findByIdAndUpdate(req.body.id, { status: true },{new:true})
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
})

const viewDrivers=(req,res)=>{
    DriverSchema.find()
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
const viewADriver=(req,res)=>{
    DriverSchema.find({_id:req.params.id})
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
module.exports = { DriverRegistration, upload, login,EditProfile,ForgotPassword,ApproveDriver,DeactivateDriver,ActivateDriver,viewDrivers,viewADriver }