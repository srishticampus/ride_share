import React, { useState } from 'react';
import '../Style/ForgotPass.css';
import LoginNav from '../Common/LoginNav';
import Service from '../../Services/apiService';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const DriverResetPass = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { phoneNumber } = useParams();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    
    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!phoneNumber) {
            toast.error('Phone number is missing');
            return;
          }
      
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
      
        if (formData.password.length < 8) {
          toast.error('Password must be at least 8 characters');
          return;
        }
      
        try {
          setIsLoading(true);
          await Service.driverForgotPassword(phoneNumber, formData.password);
      
          toast.success("Password reset successfully");
          setTimeout(() => {
            navigate('/driver-login');
          }, 2000);
        } catch (err) {
            console.log(err);
            
          toast.error(err.message || 'Failed to reset password. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };    return (
        <div className="reset-password-container">
            <LoginNav />
            <ToastContainer />
            <main className="reset-password-main">
                <h1 className="reset-password-title">RESET PASSWORD</h1>
                <form className="reset-password-form" autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <p className="form-instructions">
                        Enter New Password To Reset.
                    </p>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">New Password</label>
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            placeholder="Enter New Password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{border:"1px solid white"}}

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Enter Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{border:"1px solid white"}}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    <div className="submit-container">
                        <button
                            className="submit-btn"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'PROCESSING...' : 'DONE'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default DriverResetPass;