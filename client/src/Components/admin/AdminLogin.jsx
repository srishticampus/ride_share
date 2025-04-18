import React from 'react'
import Logo from '../../Assets/logo.png'
import { TextField, FormLabel, Button } from '@mui/material';

import '../Style/Login.css'
function AdminLogin() {
    return (
        <div>

        <div className='admin-login-main-container'>
            <img src={Logo} alt="" />
            <div className='admin-login-form'>
                <h2> LOG IN</h2>
                <FormLabel className="reg-form-label">E-Mail ID</FormLabel>
                <TextField
                    placeholder='Enter your Full Name'
                    name='Email'
                    type='email'
                    required
                    margin='normal'
                    variant="outlined"
                    className='login-input'
                />
                <FormLabel className="reg-form-label">Password</FormLabel>
                <TextField
                    placeholder='Enter your Full Name'
                    name='Name'
                    type='password'
                    required
                    margin='normal'
                    variant="outlined"
                    className='login-input'
                />
                <Button variant="contained" className="Login-button">
                    LOG IN
                </Button>            
                </div>
        </div>
        </div>

    )
}

export default AdminLogin