import React, { useState } from "react";
import Logo from '../../Assets/RideShare.png';
import { TextField, FormLabel, Button } from "@mui/material";
import apiService from "../../Services/apiService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Style/Login.css";
import { Link } from "react-router-dom";
import LandingNav from "../Common/LandingNav";
function DriverLogin() {
    const [credentials, setCredentials] = useState({
        phoneNumber: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await apiService.driverLogin(credentials);
            localStorage.setItem("driverToken", response.token);

            toast.success("Login successful! Redirecting...");

            setTimeout(() => {
                navigate("/User-home-page");
            }, 2000);
        } catch (err) {
            const errorMessage =
                err.message ||
                "Login failed. Please check your credentials.";
            toast.error(errorMessage);
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-main-container">
            <LandingNav/>
            <ToastContainer />
            <img src={Logo} alt="Company Logo" />
            <div className="admin-login-form">
                <h2>DRIVER LOG IN</h2>
                <form onSubmit={handleSubmit}>
                    <FormLabel className="reg-form-label">Phone No</FormLabel>
                    <TextField
                        placeholder="Enter your Phone Number"
                        name="phoneNumber"
                        type="number"
                        value={credentials.phoneNumber}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                        variant="outlined"
                        className="login-input"
                    />
                    <FormLabel className="reg-form-label">Password</FormLabel>
                    <TextField
                        placeholder="Enter your Password"
                        name="password"
                        type="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                        variant="outlined"
                        className="login-input"
                    />
                    <Link to='/driver-forgot-pass' style={{ textAlign: "right", color: "#f1b92e", textDecoration: "none", position: 'relative', left: "320px" }}>Forgot Password ?</Link>
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            className="Login-button"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "LOG IN"}
                        </Button>
                    </div>
                   <p style={{textAlign:"center",color:"white"}}> Don't you have an Account ? <Link to='/driver-registration' style={{color:"#f1b92e", textDecoration:"none"}}>Sign in</Link></p> 

                </form>      
                </div>
        </div>
    );
}

export default DriverLogin;