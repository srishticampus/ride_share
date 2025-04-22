import React from 'react';
import '../Style/ForgotPass.css';
import Logo from "../../Assets/Logo.png";
import LoginNav from '../Common/LoginNav';
const RiderForgotPass = () => {
  return (
    <div className="forgot-password-container">
<LoginNav/>
      <main className="forgot-password-main">
        <h1 className="forgot-password-title">FORGOT PASSWORD?</h1>
        <form className="forgot-password-form" method="POST">
          <p className="form-instructions">
            Please enter the e-mail associated with your account and we'll send you
            password reset instructions.
          </p>
          <label className="email-label" htmlFor="email">Enter Your E-Mail</label>
          <input 
            className="email-input" 
            id="email" 
            name="email" 
            required 
            type="email" 
          />
          <div className="submit-container">
            <button className="submit-btn" type="submit">NEXT</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RiderForgotPass;