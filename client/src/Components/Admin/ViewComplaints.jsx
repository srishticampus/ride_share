import React, { useEffect, useState } from 'react';
import '../Style/DriverComplaint.css';
import AdminNav from './AdminNav';
import AdminSidemenu from './AdminSidemenu';
import apiService from '../../Services/apiService';
import { toast } from 'react-toastify';

const ViewComplaints = () => {
  const [activeTab, setActiveTab] = useState('driver');
  const [driverComplaints, setDriverComplaints] = useState([]);
  const [riderComplaints, setRiderComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseTexts, setResponseTexts] = useState({});
  const [resolutionStatuses, setResolutionStatuses] = useState({});

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllDisputes();

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
            image: complaint.driverId.driverPic || 'https://via.placeholder.com/150',
            incidentDate: complaint.incidentDate,
            attachment: complaint.attachment,
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
            image: complaint.reportedBy.profilePicture || 'https://via.placeholder.com/150',
            incidentDate: complaint.incidentDate,
            attachment: complaint.attachment,
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
      toast.error(err.response?.data?.message || 'Failed to fetch complaints');
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
        responseText: responseTexts[complaintId],
        resolutionStatus: resolutionStatuses[complaintId]
      };

      const response = await apiService.responseDispute(complaintId, responseData);

      if (response.status === 'success') {
        toast.success('Response submitted successfully');
        fetchComplaints(); 
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error(error.response?.data?.message || 'Failed to submit response');
    }
  };

  const renderAttachment = (attachment) => {
    if (!attachment) return null;

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const isImage = imageExtensions.some(ext => attachment.toLowerCase().endsWith(ext));

    return (
      <div className="attachment-container">
        {isImage ? (
          <img 
            src={attachment} 
            alt="Complaint attachment" 
            className="complaint-attachment"
          />
        ) : (
          <a 
            href={attachment} 
            target="_blank" 
            rel="noopener noreferrer"
            className="attachment-link"
          >
            View Attachment
          </a>
        )}
      </div>
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
                      src={complaint.image}
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
                  </div>

                  <form className="response-form" onSubmit={(e) => handleSubmit(e, complaint.id)}>
                    <div className="response-controls">
                      <input
                        type="text"
                        className="response-input"
                        placeholder="Enter your response..."
                        value={responseTexts[complaint.id] || ''}
                        onChange={(e) => handleResponseChange(complaint.id, e.target.value)}
                        required
                      />
                      <select
                        className="status-dropdown"
                        value={resolutionStatuses[complaint.id] || 'Pending'}
                        onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button className="response-btn" type="submit">
                        Submit Response
                      </button>
                    </div>
                  </form>
                </article>
              ))
            ) : (
              <div className="no-complaints">
                No pending {activeTab} complaints found
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ViewComplaints;