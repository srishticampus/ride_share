import React, { useState } from 'react';
import '../Style/ForgotPass.css';
import LoginNav from '../Common/LoginNav';
import Service from '../../Services/apiService';
import { useParams, useNavigate } from 'react-router-dom';

const RiderResetPass = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { phoneNumber } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setIsLoading(true);
                        await Service.driverForgotPassword({
                phoneNumber,
                password: formData.password
            });
            
            setSuccess(true);
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/rider-login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <LoginNav />

            <main className="reset-password-main">
                <h1 className="reset-password-title">RESET PASSWORD</h1>
                <form className="reset-password-form" autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <p className="form-instructions">
                        Enter New Password To Reset.
                    </p>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">Password reset successfully! Redirecting to login...</div>}

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">New Password</label>
                        <input
                            className="password-input"
                            id="password"
                            name="password"
                            placeholder="Enter New Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            className="password-input"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Enter Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
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

export default RiderResetPass;