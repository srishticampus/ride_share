import React from 'react';
import Avatar from '@mui/material/Avatar';
import DriverNav from './DriverNav';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import '../Style/ViewRide.css';

const ViewRequest = () => {
    return (
        <div className="view-ride-container">
            <DriverNav />

            <main className="view-ride-main">
                <h1 className="view-ride-title">VIEW REQUESTS</h1>

                <section className="view-ride-grid">
                    {[...Array(100)].map((_, index) => (
                        <article key={index} className="view-req-card" >
                            <Avatar
                                alt="Remy Sharp"
                                src="https://imgs.search.brave.com/45ReukZZmKqWuPkXRnxP5bVyppI3aDdjgZoK-_Yr6Ec/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE1/NDY0MjYzMi9waG90/by9jbG9zZS11cC1w/b3J0cmFpdC1vZi1i/cnVuZXR0ZS13b21h/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9ZDhXX0MyRC0y/clhsbmt5bDhFaXJw/SEdmLUdwTTYyZ0Jq/cERvTnJ5eTk4VT0"
                                sx={{ width: 70, height: 70 }}
                            />              
                            <div className="view-ridereq-details">
                                <p className="view-ride-pickup" style={{ color: "#f59e0b", fontSize: "18px", marginLeft: "40px" }}>Alexa</p>
                                <p className="view-Req-details">
                                    <EmailIcon className="view-ride-marker" />
                                    Alexa@gmail.com
                                </p>
                                <p className="view-Req-details">
                                    <PhoneIcon className="view-ride-marker" />
                                    9876543210
                                </p>
                                <p className="view-Req-details">
                                    <LocationOnIcon className="view-ride-marker" />
                                    1234, Street, City, State, Zip
                                </p>
                                <p className="view-Req-details">
                                    <PhoneIcon className="view-ride-marker" />
                                    7025912190
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<CheckCircleIcon />}
                                        sx={{
                                            color: '#4caf50',
                                            borderColor: '#4caf50',
                                            '&:hover': {
                                                borderColor: '#388e3c',
                                                backgroundColor: 'rgba(76, 175, 80, 0.04)'
                                            }
                                        }}
                                    >
                                        Approve
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<CancelIcon />}
                                        sx={{
                                            color: '#f44336',
                                            borderColor: '#f44336',
                                            '&:hover': {
                                                borderColor: '#d32f2f',
                                                backgroundColor: 'rgba(244, 67, 54, 0.04)'
                                            }
                                        }}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default ViewRequest;