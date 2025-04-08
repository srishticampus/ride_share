const express = require("express");
const router = express.Router();

const AdminController = require('./controllers/adminController')
const DriverController = require('./controllers/driverController')
const UserController =require('./controllers/userController')
const VehicleController = require('./controllers/vehicleController')
const ProfileController = require('./controllers/ProfileController')
const RideReqController = require('./controllers/RideReqController')
const RideController = require('./controllers/RideController')
const PaymentController = require('./controllers/PaymentController')
const RatingController =require('./controllers/RatingController')
const DisputeController = require('./controllers/disputesController')

// Admin routes
router.post('/loginAdmin',AdminController.login)

// Driver routes
router.post('/driverReg',DriverController.upload,DriverController.DriverRegistration)
router.post('/driverlogin',DriverController.login)
router.post('/driverupdate',DriverController.upload,DriverController.EditProfile)
router.post('/driverforgot',DriverController.ForgotPassword)
router.post('/AdminApprove',DriverController.ApproveDriver)
router.post('/deactivate',DriverController.DeactivateDriver)
router.post('/activate',DriverController.ActivateDriver)
router.post('/viewDrivers',DriverController.viewADriver)
router.post('/viewADriver/:id',DriverController.viewADriver)

// User routes
router.post('/userRegistration',UserController.upload,UserController.UserRegistration)
router.post('/loginuser',UserController.login)
router.post('/userforgot',UserController.ForgotPassword)
router.post('/userupdate',UserController.upload,UserController.EditProfile)
router.post('/showAllUser',UserController.showAllUsers)
router.post('/showAUser',UserController.showAUser)

// Profile router
router.post('/addprofile',ProfileController.setProfile)
router.post('/allprofile',ProfileController.ShowAllProfiles)
router.post('/aProfile/:id',ProfileController.aProfile)


// Vehicle routes
router.post('/vehicledetails',VehicleController.AddVehicleDtl)
router.post('/editvehicle/:id',VehicleController.updateDetails)
router.post('/showAllVehicle',VehicleController.ShowAllVehicle)
router.post('/showAVehicle/:id',VehicleController.ShowAVehicle)

// RidesReq Route
router.post('/newReqride',RideReqController.addRideReq)
router.post('/viewRideReq/:id',RideReqController.viewReq)
router.post('/allRideReq',RideReqController.allReq)
router.post('/acceptReq',RideReqController.acceptReq)
router.post('/dislineReq',RideReqController.dislineReq)
router.post('/cancelReq',RideReqController.deleteReq)
router.post('/changeDriver',RideReqController.changeDriver)
router.post('/viewARideReq/:id',RideReqController.viewARideRequest)

// Ride Route
router.post('/newride',RideController.newRide)
router.post('/showAllRide',RideController.showAllRides)
router.post('/showAride/:id',RideController.viewAride)


// Payment Route
router.post('/payment',PaymentController.newPayment)
router.post('/confirmPayment',PaymentController.confirmPayment)
router.post('/failedPayment',PaymentController.FailedPayment)
router.post('/completedPayment',PaymentController.showCompletedPayments)
router.post('/unCompletedPayment',PaymentController.showFailedPayments)

// Rating Route
router.post('/rating',RatingController.newRating)
router.post('/viewAllRating',RatingController.viewAllRating)
router.post('/viewARating/:id',RatingController.viewARating)
router.post('/editRating/:id',RatingController.editRating)
router.post('/deleteRating/:id',RatingController.deleteRating)

// Dispute Route
router.post('/dispute',DisputeController.newDispute)
router.post('/solved',DisputeController.disputeSolve)
router.post('/dismiss',DisputeController.disputeDismissed)
router.post('/viewDisputed',DisputeController.showAllDisputes)
router.post('/showAdispute/:id',DisputeController.showADisputes)

module.exports=router