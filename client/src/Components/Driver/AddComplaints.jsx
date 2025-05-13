import React, { useState, useRef, useEffect } from 'react';
import '../Style/RiderPayment.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Footer from '../Common/Footer';
import DriverNav from './DriverNav';
import { useNavigate } from 'react-router-dom';
import service from '../../Services/apiService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClickAwayListener } from '@mui/material';
import DriverViewProfile from './DriverViewProfile';
import DriverEditProfile from './DriverEditProfile';

const AddComplaints = () => {
    const currentDriver = JSON.parse(localStorage.getItem("driverData"));
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [showProfileEditCard, setShowProfileEditCard] = useState(false);
    
    const initialFormState = {
        Subject: '',
        incidentDate: '',
        priorityLevel: '',
        complaintDescription: '',
        attachment: null,
        driverId: currentDriver._id
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const onAvatarClick = () => {
        setShowProfileCard(prev => !prev);
        if (!showProfileCard) {
            setShowProfileEditCard(false);
        }
    };

    const onEditClick = () => {
        setShowProfileEditCard(true);
        setShowProfileCard(false);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });
    };

    const resetForm = () => {
        setFormData(initialFormState);
        // Clear the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('subject', formData.Subject);
            formDataToSend.append('incidentDate', formData.incidentDate);
            formDataToSend.append('priorityLevel', formData.priorityLevel);
            formDataToSend.append('description', formData.complaintDescription);
            formDataToSend.append('driverId', formData.driverId);

            if (formData.attachment) {
                formDataToSend.append('attachment', formData.attachment);
            }

            const response = await service.createDispute(formDataToSend);

            if (response) {
                toast.success('Complaint submitted successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                resetForm();
            } else {
                toast.error('Failed to submit complaint. Please try again.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Something went wrong', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="payment-container">
            <DriverNav onAvatarClick={onAvatarClick} currentDriver={currentDriver} />

            {/* Profile View Card */}
            {showProfileCard && currentDriver && (
                <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                    <div style={{ position: "absolute", top: "40px", right: "20px" }}>
                        <DriverViewProfile onEditClick={onEditClick} driver={currentDriver} />
                    </div>
                </ClickAwayListener>
            )}

            {/* Profile Edit Card */}
            {showProfileEditCard && currentDriver && (
                <ClickAwayListener onClickAway={() => setShowProfileEditCard(false)}>
                    <div style={{ 
                        position: "absolute", 
                        top: "10vh", 
                        left: "250px", 
                        backgroundColor: "white", 
                        zIndex: "5", 
                        borderRadius: "25px" 
                    }}>
                        <DriverEditProfile
                            setShowProfileEditCard={setShowProfileEditCard}
                            currentDriver={currentDriver}
                            setCurrentDriver={(updatedDriver) => {
                                localStorage.setItem("driverData", JSON.stringify(updatedDriver));
                            }}
                        />
                    </div>
                </ClickAwayListener>
            )}

            <main className="payment-main">
                <section className="payment-section">
                    <h1 className="payment-title">ADD COMPLAINT</h1>
                    <form className="payment-form" onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="complaint-form-grid">
                            <div className="complaint-left-column">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="Subject">Subject / Title</label>
                                    <input
                                        className="form-input"
                                        id="Subject"
                                        name="Subject"
                                        placeholder="Enter complaint subject"
                                        type="text"
                                        value={formData.Subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="incidentDate">Date of Incident</label>
                                    <div className="date-input-wrapper">
                                        <input
                                            className="form-input"
                                            id="incidentDate"
                                            name="incidentDate"
                                            type="date"
                                            value={formData.incidentDate}
                                            onChange={handleChange}
                                            required
                                        />
                                        <FaCalendarAlt className="calendar-icon" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="priorityLevel">Priority Level</label>
                                    <select
                                        className="form-input"
                                        id="priorityLevel"
                                        name="priorityLevel"
                                        value={formData.priorityLevel}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option disabled value="">Select priority level</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <div className="complaint-right-column">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="complaintAttachment">Attachment</label>
                                    <input
                                        ref={fileInputRef}
                                        className="form-input"
                                        id="attachment"
                                        name="attachment"
                                        type="file"
                                        onChange={handleChange}
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                </div>

                                <div className="form-group complaint-description-group">
                                    <label className="form-label" htmlFor="complaintDescription">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        id="complaintDescription"
                                        name="complaintDescription"
                                        placeholder="Describe your complaint in detail"
                                        rows="5"
                                        value={formData.complaintDescription}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="submit-container">
                            <button
                                className="submit-btn"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AddComplaints;