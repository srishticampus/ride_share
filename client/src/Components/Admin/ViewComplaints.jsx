import React, { useEffect, useState } from 'react';
import '../Style/DriverComplaint.css';
import AdminNav from './AdminNav';
import AdminSidemenu from './AdminSidemenu';
import apiService from '../../Services/apiService';
import { toast } from 'react-toastify';

const ViewComplaints = () => {
  const [activeTab, setActiveTab] = useState('driver');
  const [driverComplaints, setDriverComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await apiService.getAllDisputes();
        console.log(response);
        
        if (response.status === 'success') {
          // Filter complaints where driverId exists (driver complaints)
          const driverComplaintsData = response.data.disputes
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
              image: complaint.driverId.driverPic || 'https://storage.googleapis.com/a1aa/image/6a0122db-4089-47a3-3a2d-f5195e5122b9.jpg',
              priority: complaint.priorityLevel,
              status: complaint.resolutionStatus,
              incidentDate: complaint.incidentDate,
              attachment: complaint.attachment
            }));
          // console.log(complaint.driverId.driverPic);
          
          setDriverComplaints(driverComplaintsData);
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

    fetchComplaints();
  }, []);

  // Helper function to generate random background colors
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle response submission
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
            {driverComplaints.length > 0 ? (
              driverComplaints.map((complaint) => (
                <article key={complaint.id} className={`complaint-card ${complaint.bgColor}`}>
                  <div className="complaint-header">
                    <img 
                      alt={`Profile of ${complaint.image}`} 
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
                  <form className="response-form" onSubmit={handleSubmit}>
              <input className="response-input" placeholder="Add a response..." type="text" />
              <button className="response-btn" type="submit">SEND</button>
            </form>

                  {/* {complaint.attachment && (
                    <div className="complaint-attachment">
                      <p>Attachment:</p>
                      <img 
                        src={complaint.attachment} 
                        alt="Complaint attachment" 
                        className="attachment-img"
                      />
                    </div>
                  )} */}
                </article>
              ))
            ) : (
              <div className="no-complaints">No driver complaints found</div>
            )}

            {/* <form className="response-form" onSubmit={handleSubmit}>
              <input className="response-input" placeholder="Add a response..." type="text" />
              <button className="response-btn" type="submit">SEND</button>
            </form> */}

            <nav className="pagination">
              <span>Show</span>
              <select className="pagination-select">
                <option>4</option>
                <option>8</option>
                <option>12</option>
              </select>
              <span>per page</span>
              <span>1-{driverComplaints.length} of {driverComplaints.length}</span>
              <button className="pagination-arrow">←</button>
              <button className="pagination-number active">1</button>
              <button className="pagination-arrow">→</button>
            </nav>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ViewComplaints;