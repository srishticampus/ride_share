const Admin = require('../models/adminModel');
const login = (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@gmail.com") {
        if (password === "admin@123") {
            return res.json({ status: 200, msg: "Login Successful" });
        }
        return res.json({ status: 405, msg: "Password Mismatch" });
    }

    Admin.findOne({ email })
        .then(user => {
            if (!user) {
                return res.json({ status: 405, msg: "invalid Email" });
            }
        })
        .catch(err => {
            console.error(err);
            res.json({ status: 500, msg: "Something went wrong" });
        });
};


module.exports = { login };