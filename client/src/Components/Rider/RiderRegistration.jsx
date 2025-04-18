import React from 'react';
import Logo from '../../Assets/Logo.png';
import {
    TextField,
    FormLabel,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import '../Style/DriverRegistration.css';

function RideRegistration() {
    const [paymentMethod, setPaymentMethod] = React.useState('');
    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };
    return (
        <div className="registration-container">
            <div className="registration-logo">
                <img src={Logo} alt="Company Logo" />
            </div>

            <div className="registration-form">
                <h2 className="registration-title">REGISTRATION</h2>
                <div className='reg-main-container'>
                    <div className='reg-left'>
                        <FormLabel className="reg-form-label">Name</FormLabel>
                        <TextField
                            placeholder='Enter your Full Name'
                            name='Name'
                            type='text'
                            required
                            margin='normal'
                            className="form-input"
                            variant="outlined"
                        />

                        <FormLabel className="reg-form-label">E-Mail</FormLabel>
                        <TextField
                            name='Email'
                            placeholder='Enter your Mail ID'
                            type='email'
                            required
                            margin='normal'
                            className="form-input"
                            variant="outlined"
                        />

                        <FormLabel className="reg-form-label">Phone Number</FormLabel>
                        <TextField
                            name='PhoneNo'
                            placeholder='Enter your Number'
                            type='tel'
                            required
                            margin='normal'
                            className="form-input"
                            variant="outlined"
                        />

                        <FormLabel className="reg-form-label">Contact Number</FormLabel>
                        <TextField
                            name='VehicleRegNumber'
                            placeholder='Enter Register Number'
                            type='text'
                            required
                            margin='normal'
                            className="form-input"
                            variant="outlined"
                        />

                        <FormLabel className="reg-form-label">Address</FormLabel>
                        <TextField
                            name='VehicleTypeModel'
                            placeholder='Enter your Vehicle Type & Model'
                            type='text'
                            required
                            margin='normal'
                            className="form-input"
                            variant="outlined"
                        />
                    </div>

                    <div className='reg-right'>
                        <FormLabel className="reg-form-label">Create Password</FormLabel>
                        <TextField
                            name='Password'
                            placeholder='Enter your Password'
                            type='password'
                            required
                            margin='normal'
                            className="form-input"
                            variant="outlined"
                        />

                        <FormLabel className="reg-form-label">Confirm Password</FormLabel>
                        <TextField
                            name='ConfirmPassword'
                            placeholder='Enter your Password'
                            type='password'
                            required
                            margin='normal'
                            className="form-input"
                            variant="outlined"
                        />
                        <FormLabel className="reg-form-label">Profile Picture</FormLabel>
                        <TextField
                            type='file'
                            name='ProfilePicture'
                            required
                            margin='normal'
                            InputLabelProps={{ shrink: true }}
                            className="form-input file-input"
                            variant="outlined"
                        />



                        <FormLabel className="reg-form-label">Payment</FormLabel>
                        <FormControl fullWidth margin="normal" className="form-input">
                            <Select
                                value={paymentMethod}
                                onChange={handlePaymentChange}
                                required
                            >
                                <MenuItem value="credit_card">Cash</MenuItem>
                                <MenuItem value="debit_card">UPI</MenuItem>
                                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                            </Select>
                        </FormControl>

                    </div>
                </div>
                <div className="registration-actions">
                    <Button variant="contained" className="register-button">
                        Register
                    </Button>
                    <span className="login-text">
                        <p style={{ color: "white" }}> Already have an account? <a href="/login" className="login-link">LOG IN</a></p>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default RideRegistration;