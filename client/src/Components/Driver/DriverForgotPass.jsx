import React, { useState } from 'react';
import '../Style/ForgotPass.css';
import Logo from "../../Assets/Logo.png";
import LoginNav from '../Common/LoginNav';
import service from '../../Services/apiService';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const DriverForgotPass = () => {
    const navigate = useNavigate()
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await service.FindDriverPh(phoneNumber);
            console.log(response);
            
            if (response.status === 'success') {
                // toast.success("Phone number verified! Redirecting...");
                alert("Phone number verified! Redirecting...")
                console.log('Driver found:', response.data);
                setTimeout(() => {
                    navigate(`/driver-Reset-Pass/${response.data.phoneNumber}`)
                }, 2000);
    
            } else {
                // toast.error(response.message || 'No driver found with this phone number');
                alert("response.message || 'No driver found with this phone number")
            }
            
        } catch (err) {
            // toast.error(err.message || 'Failed to send reset instructions');
            // alert(err.message || 'Failed to send reset instructions')
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <LoginNav />
            <main className="forgot-password-main">
                <h1 className="forgot-password-title">FORGOT PASSWORD?</h1>
                <form className="forgot-password-form" onSubmit={handleSubmit}>
                    <p className="form-instructions">
                        Please enter the phone number associated with your account and we'll send you
                        password reset instructions.
                    </p>
                    
                    <label className="email-label" htmlFor="phoneNumber">Enter Your Phone Number</label>
                    <input
                        className="email-input"
                        id="phoneNumber"
                        name="phoneNumber"
                        required
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={loading}
                        placeholder="e.g., +1234567890"
                        pattern="[+]{0,1}[0-9]{10,15}"
                    />
                    
                    <div className="submit-container">
                        <button 
                            className="submit-btn" 
                            type="submit"
                            disabled={loading || !phoneNumber}
                        >
                            {loading ? 'SENDING...' : 'NEXT'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default DriverForgotPass;