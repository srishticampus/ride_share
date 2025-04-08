const UserSchema = require('../models/UserModel')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage }).single('profilePicture')

const UserRegistration = (req, res) => {
    const {email,password,fullName,phoneNumber, } = req.body
    let User = new UserSchema({
        email,
        fullName,
        phoneNumber,
        password,
        profilePicture: req.file 
    })

    User.save()
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

    UserSchema.findOne({ phoneNumber }).then(user => {
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }

        if (user.password !== password) {
            return res.status(403).json({ msg: 'Password Mismatch !!' })
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
        UserSchema.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, { password: req.body.password }, { new: true })
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
        email:req.body.email,
        fullName:req.body.fullName,
        phoneNumber:req.body.phoneNumber,
        profilePicture: req.file 
    }
    UserSchema.findByIdAndUpdate(req.body.id, data, { new: true })
    .then((result) => {
        res.status(200).json({
            data: result
        })
    })
    .catch((error) => {
        res.status(500).json({
            message: "Error on editing User",
            error: error.message
        })
    })
}
const showAllUsers=(req,res)=>{
    UserSchema.find()
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

const showAUser=(req,res)=>{
    UserSchema.findById(req.params.id)
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

module.exports = { UserRegistration, upload,login,ForgotPassword,EditProfile,showAllUsers,showAUser }