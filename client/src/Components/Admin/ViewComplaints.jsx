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
console.log(response);

      if (response.status === 'success') {
        // Filter only pending complaints for drivers
        const driverComplaintsData = response.data.disputes
          .filter(complaint => complaint.driverId && complaint.resolutionStatus === 'Pending')
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
            image: complaint.driverId.driverPic || 'https://storage.googleapis.com/a1aa/image/6a0122db-4089-47a3-3a2d-f5195e5122b9.jpg',
            incidentDate: complaint.incidentDate,
            attachment: complaint.attachment,
          }));

        // Filter only pending complaints for riders
        const riderComplaintsData = response.data.disputes
          .filter(complaint => complaint.reportedBy && complaint.resolutionStatus === 'Pending')
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
            image: complaint.reportedBy.profilePicture || 'https://storage.googleapis.com/a1aa/image/6a0122db-4089-47a3-3a2d-f5195e5122b9.jpg',
            incidentDate: complaint.incidentDate,
            attachment: complaint.attachment,
          }));

        setDriverComplaints(driverComplaintsData);
        setRiderComplaints(riderComplaintsData);

        // Initialize response texts and statuses
        const initialResponses = {};
        const initialStatuses = {};

        response.data.disputes.forEach(complaint => {
          initialResponses[complaint._id] = '';
          initialStatuses[complaint._id] = 'Pending';
        });

        setResponseTexts(initialResponses);
        setResolutionStatuses(initialStatuses);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      if (err.response?.data?.status === "fail") {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to fetch complaints');
      }
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
      } else {
        toast.error(response.message || 'Failed to submit response');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error(error.message || 'Failed to submit response');
    }
  };

const renderAttachment = (attachment) => {
  if (!attachment) return null;

  // Assuming attachments are stored in a specific bucket with a base URL
  const attachmentBaseUrl = "http://localhost:4052/ride_share_api/";

  
  // Check if it's an image by file extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const isImage = imageExtensions.some(ext => attachment.toLowerCase().endsWith(ext));

  if (isImage) {
    return (
      <div className="attachment-container">
        <img 
          src={`${attachmentBaseUrl}${attachment}`} 
          alt="Complaint attachment" 
          className="complaint-attachment"
          style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
        />
      </div>
    );
  } else {
    return (
      <div className="attachment-container" style={{ marginTop: '10px' }}>
        <a 
          href={`${attachmentBaseUrl}${attachment}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="attachment-link"
        >
          Download Attachment
        </a>
      </div>
    );
  }
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
            <h2>Complaints</h2>
          </div>

          <div className="content-header">
            <div className="header-tabs">
              <div
                className={`header-tab ${activeTab === 'rider' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('rider')}
              >
                Rider
              </div>
              <div
                className={`header-tab ${activeTab === 'driver' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('driver')}
              >
                Driver
              </div>
            </div>
          </div>

          <section className="complaints-list">
            {activeTab === 'driver' ? (
              driverComplaints.length > 0 ? (
                driverComplaints.map((complaint) => (
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
                    <p className="complaint-title">{complaint.title}</p>
                    <p className="complaint-content">{complaint.content}</p>

                    {renderAttachment(complaint.attachment)}

                    <form className="response-form" onSubmit={(e) => handleSubmit(e, complaint.id)}>
                      <div className="response-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="response-input"
                          placeholder="Add a response..."
                          value={responseTexts[complaint.id] || ''}
                          onChange={(e) => handleResponseChange(complaint.id, e.target.value)}
                          required
                          style={{ flex: 1 }}
                        />

                        <select
                          className="status-dropdown"
                          value={resolutionStatuses[complaint.id] || 'Pending'}
                          onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                          style={{ width: '120px' }}
                        >
                          {/* <option value="Pending">Pending</option> */}
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                        <button className="response-btn" type="submit" style={{ padding: '8px 16px' }}>
                          SUBMIT
                        </button>
                      </div>
                    </form>
                  </article>
                ))
              ) : (
                <div className="no-complaints">No pending driver complaints found</div>
              )
            ) : (
              riderComplaints.length > 0 ? (
                riderComplaints.map((complaint) => (
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
                    <p className="complaint-title">{complaint.title}</p>
                    <p className="complaint-content">{complaint.content}</p>

                    {renderAttachment(complaint.attachment)}

                    <form className="response-form" onSubmit={(e) => handleSubmit(e, complaint.id)}>
                      <div className="response-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="response-input"
                          placeholder="Add a response..."
                          value={responseTexts[complaint.id] || ''}
                          onChange={(e) => handleResponseChange(complaint.id, e.target.value)}
                          required
                          style={{ flex: 1 }}
                        />

                        <select
                          className="status-dropdown"
                          value={resolutionStatuses[complaint.id] || 'Pending'}
                          onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                          style={{ width: '120px' }}
                        >
                          {/* <option value="Pending">Pending</option> */}
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                        <button className="response-btn" type="submit" style={{ padding: '8px 16px' }}>
                          SUBMIT
                        </button>
                      </div>
                    </form>                  </article>
                ))
              ) : (
                <div className="no-complaints">No pending rider complaints found</div>
              )
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ViewComplaints;