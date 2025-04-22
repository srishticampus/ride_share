import React from 'react';
import '../Style/ForgotPass.css';
import LoginNav from '../Common/LoginNav';

const RiderResetPass = () => {
    return (
        <div className="reset-password-container">
            <LoginNav />

            <main className="reset-password-main">
                <h1 className="reset-password-title">RESET PASSWORD</h1>
                <form className="reset-password-form" autoComplete="off" noValidate>
                    <p className="form-instructions">
                        Enter New Password To Reset.
                    </p>

                    <div className="input-group">
                        <label className="input-label" htmlFor="new-password">New Password</label>
                        <input
                            className="password-input"
                            id="new-password"
                            name="new-password"
                            placeholder="Enter New Password"
                            type="password"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="confirm-password">Confirm Password</label>
                        <input
                            className="password-input"
                            id="confirm-password"
                            name="confirm-password"
                            placeholder="Enter Confirm Password"
                            type="password"
                        />
                    </div>

                    <div className="submit-container">
                        <button className="submit-btn" type="submit">DONE</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default RiderResetPass;