import React, { useState } from "react";
import Logo from '../../Assets/RideShare.png';
import { TextField, FormLabel, Button, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import apiService from "../../Services/apiService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Style/Login.css";
import { Link } from "react-router-dom";
import LandingNav from "../Common/LandingNav";

function RiderLogin() {
  const [credentials, setCredentials] = useState({
    phoneNumber: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.login(credentials);
      console.log(response);

      localStorage.setItem("riderId", response.data.user._id)

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
        <h2>RIDER LOG IN</h2>
        <form onSubmit={handleSubmit}>
          <FormLabel className="reg-form-label">Phone No</FormLabel>
          <TextField
            placeholder="Enter your Phone Number"
            name="phoneNumber"
            autoComplete="off"
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
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            onChange={handleInputChange}
            required
            margin="normal"
            variant="outlined"
            className="login-input"
            style={{width:"450px"}}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    style={{ color: '#f1b92e' }} 

                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Link to='/User-forgot-pass'className="forgot-password-link">Forgot Password ?</Link>

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
          <p style={{ textAlign: "center", color: "white" }}> Don't you have an Account ? <Link to='/User-registration' className="reg-link">Sign-up</Link></p>
        </form>
      </div>
    </div>
  );
}

export default RiderLogin;