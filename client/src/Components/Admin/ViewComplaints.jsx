import React, { useEffect, useState } from 'react';
import '../Style/DriverComplaint.css';
import AdminNav from './AdminNav';
import AdminSidemenu from './AdminSidemenu';
import apiService, { imageBaseUrl } from '../../Services/apiService';
import { toast ,ToastContainer } from 'react-toastify';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ViewComplaints = () => {
  const [activeTab, setActiveTab] = useState('driver');
  const [driverComplaints, setDriverComplaints] = useState([]);
  const [riderComplaints, setRiderComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseTexts, setResponseTexts] = useState({});
  const [resolutionStatuses, setResolutionStatuses] = useState({});
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const riderBaseUrl = 'http://localhost:4052/ride_share_api';

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllDisputes();
      console.log(response);

      if (response.status === 'success') {
        const pendingComplaints = response.data.disputes.filter(
          complaint => complaint.resolutionStatus === 'Pending'
        );

        const driverComplaintsData = pendingComplaints
          .filter(complaint => complaint.driverId)
          .map(complaint => ({
            id: complaint._id,
            name: complaint.driverId.fullname || 'Driver',
            date: new Date(complaint.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            title: complaint.subject,
            content: complaint.description,
            bgColor: getRandomBgColor(),
            image: `${imageBaseUrl}uploads/drivers/${complaint.driverId.driverPic}`,
            incidentDate: complaint.incidentDate,
            attachment: complaint.attachment ? `${imageBaseUrl}uploads/disputes/${complaint.attachment}` : null,
            driverId: complaint.driverId._id
          }));

        const riderComplaintsData = pendingComplaints
          .filter(complaint => complaint.reportedBy)
          .map(complaint => ({
            id: complaint._id,
            name: complaint.reportedBy.fullName || 'Rider',
            date: new Date(complaint.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            title: complaint.subject,
            content: complaint.description,
            bgColor: getRandomBgColor(),
            image: complaint.reportedBy.profilePicture 
              ? `${riderBaseUrl}/${complaint.reportedBy.profilePicture}` 
              : `${riderBaseUrl}/uploads/users/default.png`,
            incidentDate: complaint.incidentDate,
            attachment: complaint.attachment ? `${imageBaseUrl}uploads/disputes/${complaint.attachment}` : null,
            driverId: typeof complaint.driverData === 'object' 
              ? complaint.driverData._id 
              : complaint.driverData
          }));

        setDriverComplaints(driverComplaintsData);
        setRiderComplaints(riderComplaintsData);

        const initialResponses = {};
        const initialStatuses = {};

        pendingComplaints.forEach(complaint => {
          initialResponses[complaint._id] = complaint.responseText || '';
          initialStatuses[complaint._id] = complaint.resolutionStatus;
        });

        setResponseTexts(initialResponses);
        setResolutionStatuses(initialStatuses);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      // toast.error(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const getRandomBgColor = () => {
    const colors = [
      'bg-blue-200',
      'bg-green-200',
      'bg-purple-200',
      'bg-yellow-200',
      'bg-pink-200',
      'bg-indigo-200'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleResponseChange = (complaintId, text) => {
    setResponseTexts(prev => ({
      ...prev,
      [complaintId]: text
    }));
  };

  const handleStatusChange = (complaintId, status) => {
    setResolutionStatuses(prev => ({
      ...prev,
      [complaintId]: status
    }));
  };

  const handleSubmit = async (e, complaintId) => {
    e.preventDefault();

    try {
      const responseData = {
        responseText: responseTexts[complaintId] || 'No response provided',
        resolutionStatus: resolutionStatuses[complaintId] || 'Pending'
      };

      if (responseData.resolutionStatus.toLowerCase() === 'resolved') {
        responseData.resolutionStatus = 'Resolved';
      } else if (responseData.resolutionStatus.toLowerCase() === 'rejected') {
        responseData.resolutionStatus = 'Rejected';
      }

      const response = await apiService.responseDispute(complaintId, responseData);

      if (response.status === 'success') {
        // toast.success(`Complaint marked as ${responseData.resolutionStatus}`);
        alert(`Complaint marked as ${responseData.resolutionStatus}`)
        fetchComplaints();
      } else {
        // toast.error(response.message || 'Failed to update complaint status');
        alert(response.message || 'Failed to update complaint status')
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      // toast.error(error.response?.data?.message || 'Failed to submit response');
      alert(error.response?.data?.message || 'Failed to submit response')
    }
  };

  const handleDeactivateDriver = async (driverId, complaintId) => {
    if (!driverId) {
      alert('No driver associated with this complaint')
      // toast.error('No driver associated with this complaint');
      return;
    }

    if (window.confirm('Are you sure you want to deactivate this driver?')) {
      try {
        setDeactivating(true);
        const responseData = {
          responseText: 'Driver has been deactivated due to this complaint',
          resolutionStatus: 'Resolved'
        };

        await apiService.responseDispute(complaintId, responseData);
        const deactivateResponse = await apiService.deactivateDriver(driverId);
        
        if (deactivateResponse.status === 'success') {
          // toast.success('Driver deactivated successfully');
          alert('Driver deactivated successfully')
          fetchComplaints();
        }
      } catch (error) {
        console.error('Error deactivating driver:', error);
        // toast.error(error.response?.data?.message || 'Failed to deactivate driver');
        alert(error.response?.data?.message || 'Failed to deactivate driver')
      } finally {
        setDeactivating(false);
      }
    }
  };

  const handleOpenAttachment = (attachment) => {
    if (!attachment) return;
    setSelectedAttachment(attachment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAttachment(null);
  };

  const renderAttachment = (attachment) => {
    if (!attachment) return null;

    return (
      <div className="attachment-container">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenAttachment(attachment)}
          sx={{ textTransform: 'none', p: 0.5 }}
        >
          View Attachment
        </Button>
      </div>
    );
  };

  const AttachmentModal = () => {
    if (!selectedAttachment) return null;

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const isImage = selectedAttachment &&
      imageExtensions.some(ext => selectedAttachment.toLowerCase().endsWith(ext));

    return (
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="attachment-modal-title"
        aria-describedby="attachment-modal-description"
        style={{ marginLeft: "240px" }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '800px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 2,
            outline: 'none',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
              borderBottom: '1px solid #eee',
              pb: 1
            }}
          >
            <Typography id="attachment-modal-title" variant="h6" style={{ color: "#f59e0b" }}>
              Attachment Preview
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2
            }}
          >
            {isImage ? (
              <img
                src={selectedAttachment}
                alt="Complaint attachment"
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            ) : (
              <iframe
                src={selectedAttachment}
                title="Complaint attachment"
                style={{
                  width: '100%',
                  height: '70vh',
                  border: 'none'
                }}
              />
            )}
          </Box>
        </Box>
      </Modal>
    );
  };

  if (loading) {
    return (
      <div className="complaints-container">
        <AdminNav />
        <AdminSidemenu />
        <div className="main-content">
          <main className="content-area">
            <div className="loading-spinner">Loading complaints...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="complaints-container">
      <AdminNav />
      <AdminSidemenu />
      <ToastContainer/>
      <div className="main-content">
        <main className="content-area">
          <div className="header-title">
            <h2>Pending Complaints</h2>
          </div>

          <div className="content-header">
            <div className="header-tabs">
              <button
                className={`header-tab ${activeTab === 'driver' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('driver')}
              >
                Driver Complaints
              </button>
              <button
                className={`header-tab ${activeTab === 'rider' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('rider')}
              >
                Rider Complaints
              </button>
            </div>
          </div>

          <section className="complaints-list">
            {(activeTab === 'driver' ? driverComplaints : riderComplaints).length > 0 ? (
              (activeTab === 'driver' ? driverComplaints : riderComplaints).map((complaint) => (
                <article key={complaint.id} className={`complaint-card ${complaint.bgColor}`}>
                  <div className="complaint-header">
                    <img
                      alt={`Profile of ${complaint.name}`}
                      className="profile-img"
                      src={complaint.image || `${riderBaseUrl}/uploads/users/default.png`}
                      onError={(e) => {
                        e.target.src = `${riderBaseUrl}/uploads/users/default.png`;
                      }}
                    />
                    <div className="profile-info">
                      <p className="profile-name">{complaint.name}</p>
                      <p className="profile-date">{complaint.date}</p>
                    </div>
                  </div>
                  <div className="complaint-body">
                    <h3 className="complaint-title">{complaint.title}</h3>
                    <p className="complaint-content">{complaint.content}</p>
                    {renderAttachment(complaint.attachment)}
                    {complaint.incidentDate && (
                      <p className="incident-date">
                        Incident Date: {new Date(complaint.incidentDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <form className="response-form" onSubmit={(e) => handleSubmit(e, complaint.id)}>
                    <div className="response-controls">
                      <div className="status-control">
                        <select
                          className="status-dropdown"
                          value={resolutionStatuses[complaint.id] || 'Pending'}
                          onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                          required
                        >
                          <option value="Pending" disabled>Select status</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <div className="action-buttons">
                        {activeTab === 'rider' && complaint.driverId && (
                          <button
                            type="button"
                            className="deactivate-btn"
                            onClick={() => handleDeactivateDriver(complaint.driverId, complaint.id)}
                            disabled={deactivating}
                          >
                            {deactivating ? 'Processing...' : 'Deactivate Driver'}
                          </button>
                        )}
                        <button className="response-btn" type="submit">
                          Submit Response
                        </button>
                      </div>
                    </div>
                  </form>
                </article>
              ))
            ) : (
              <div className="no-rides-message">
                <h3>No pending {activeTab} complaints found</h3>
              </div>
            )}
          </section>
          <AttachmentModal />
        </main>
      </div>
    </div>
  );
};

export default ViewComplaints;