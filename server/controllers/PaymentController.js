const PaymentSchema = require('../models/PaymentModel')

const newPayment = (req, res) => {
    const { rideId, amount, paymentMethod } = req.body
    let payment = new PaymentSchema({
        rideId, amount, paymentMethod
    })
    payment.save()
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
const confirmPayment = (req, res) => {
    const data = { paymentStatus: "Completed" }
    PaymentSchema.findByIdAndUpdate(req.body.id, data, { new: true })
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
const FailedPayment = (req, res) => {
    const data = { paymentStatus: "Failed" }
    PaymentSchema.findByIdAndUpdate(req.body.id, data, { new: true })
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

const showCompletedPayments = (req, res) => {
    PaymentSchema.find({ paymentStatus: "Completed" })
        .then((results) => {
            res.status(200).json({
                data: results
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error.message
            });
        });
};

const showFailedPayments = (req, res) => {
    PaymentSchema.find({ paymentStatus: "Failed" })
        .then((results) => {
            res.status(200).json({
                data: results
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error.message
            });
        });
};



module.exports = { newPayment, confirmPayment, FailedPayment,showCompletedPayments,showFailedPayments }