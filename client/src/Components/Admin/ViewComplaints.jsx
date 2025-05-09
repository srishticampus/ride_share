import React, { useState } from 'react';
import '../Style/DriverComplaint.css';
import AdminNav from './AdminNav';
import AdminSidemenu from './AdminSidemenu';

const ViewComplaints = () => {
  const [activeTab, setActiveTab] = useState('rider');

  const riderComplaints = [
    {
      id: 1,
      name: "RIDER JOHN",
      date: "30 JAN 2025",
      title: "The app closes unexpectedly during or before a trip.",
      content: "I'm experiencing frequent app crashes either during or before starting a trip...",
      bgColor: "bg-pink-400",
      image: "https://storage.googleapis.com/a1aa/image/6a0122db-4089-47a3-3a2d-f5195e5122b9.jpg"
    },
    {
      id: 2,
      name: "RIDER PRAKEERTH",
      date: "30 JAN 2025",
      title: "Incorrect Ride Details.",
      content: "The app sometimes displays incorrect or incomplete ride details...",
      bgColor: "bg-yellow-200",
      image: "https://storage.googleapis.com/a1aa/image/1958d94c-aa9f-459a-bee2-9f7b1dbddc8b.jpg"
    }
  ];

  const driverComplaints = [
    {
      id: 1,
      name: "DRIVER JOHN",
      date: "30 JAN 2025",
      title: "Payment issues after completing trips",
      content: "I'm not receiving payments for some completed trips...",
      bgColor: "bg-blue-200",
      image: "https://storage.googleapis.com/a1aa/image/6a0122db-4089-47a3-3a2d-f5195e5122b9.jpg"
    },
    {
      id: 2,
      name: "DRIVER KEERTHY",
      date: "29 JAN 2025",
      title: "Passenger no-show issues",
      content: "When passengers cancel or don't show up...",
      bgColor: "bg-green-200",
      image: "https://storage.googleapis.com/a1aa/image/21ac932d-0701-423d-abd6-b82b1f357f46.jpg"
    },
    {
      id: 3,
      name: "DRIVER SMITH",
      date: "28 JAN 2025",
      title: "Navigation problems",
      content: "The in-app navigation often takes me to wrong locations...",
      bgColor: "bg-purple-200",
      image: "https://storage.googleapis.com/a1aa/image/1958d94c-aa9f-459a-bee2-9f7b1dbddc8b.jpg"
    }
  ];

  const complaints = activeTab === 'rider' ? riderComplaints : driverComplaints;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="complaints-container">
      <AdminNav />
      <AdminSidemenu />
      <div className="main-content">
        <main className="content-area">
          <div className="header-title">
          <h2 >Complaints</h2>

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
            {complaints.map((complaint) => (
              <article key={complaint.id} className={`complaint-card ${complaint.bgColor}`}>
                <div className="complaint-header">
                  <img alt={`Profile of ${complaint.name}`} className="profile-img" src={complaint.image} />
                  <div className="profile-info">
                    <p className="profile-name">{complaint.name}</p>
                    <p className="profile-date">{complaint.date}</p>
                  </div>
                </div>
                <p className="complaint-title">{complaint.title}</p>
                <p className="complaint-content">{complaint.content}</p>
              </article>
            ))}

            <form className="response-form" onSubmit={handleSubmit}>
              <input className="response-input" placeholder="Add a response..." type="text" />
              <button className="response-btn" type="submit">SEND</button>
            </form>

            <nav className="pagination">
              <span>Show</span>
              <select className="pagination-select">
                <option>4</option>
                <option>8</option>
                <option>12</option>
              </select>
              <span>per page</span>
              <span>1-{complaints.length} of {complaints.length}</span>
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
