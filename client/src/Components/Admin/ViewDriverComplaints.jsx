import React from 'react';
import '../Style/DriverComplaint.css';
import { 
  FaBell, 
  FaUserCircle, 
  FaThLarge, 
  FaUser, 
  FaChevronDown, 
  FaUserFriends, 
  FaHistory, 
  FaSignOutAlt 
} from 'react-icons/fa';
import AdminNav from './AdminNav';
import AdminSidemenu from './AdminSidemenu';

const ViewDriverComplaints = () => {
  const complaints = [
    {
      id: 1,
      name: "JOHN",
      date: "30 JAN 2025",
      title: "The app closes unexpectedly during or before a trip.",
      content: "I'm experiencing frequent app crashes either during or before starting a trip. The app closes unexpectedly, preventing me from accessing trip details or accepting new ride requests. This issue happens without warning and disrupts my ability to work efficiently. It's becoming a recurring problem, and I would appreciate assistance in fixing it as soon as possible.",
      bgColor: "bg-pink-400",
      image: "https://storage.googleapis.com/a1aa/image/6a0122db-4089-47a3-3a2d-f5195e5122b9.jpg"
    },
    {
      id: 2,
      name: "PRAKEERTH",
      date: "30 JAN 2025",
      title: "Incorrect Ride Details.",
      content: "The app sometimes displays incorrect or incomplete ride details, such as wrong pickup or drop-off locations, which leads to confusion and delays. It makes it difficult to navigate or plan the trip effectively.",
      bgColor: "bg-yellow-200",
      image: "https://storage.googleapis.com/a1aa/image/1958d94c-aa9f-459a-bee2-9f7b1dbddc8b.jpg"
    },
    {
      id: 3,
      name: "KEERTHY",
      date: "30 JAN 2025",
      title: "The app lags or takes too long to load ride details.",
      content: "The app takes too long to load essential information such as trip details, routes, or rider information, which slows down my ability to accept or start rides efficiently. This delay is causing frustration and impacting my ability to complete trips in a timely manner. I would appreciate any assistance in resolving this performance issue.",
      bgColor: "bg-lime-200",
      image: "https://storage.googleapis.com/a1aa/image/21ac932d-0701-423d-abd6-b82b1f357f46.jpg"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="complaints-container">
<AdminNav/>
<AdminSidemenu/>
      <div className="main-content">
        <main className="content-area">
        <h2 className="header-title">Complaints</h2>

          <div className="content-header">
            <div className="header-decoration">
              <div className="header-left">
                <div className="header-white"></div>
                <div className="header-black"></div>
              </div>
              <div className="header-rider">Rider</div>
              <div className="header-driver">Driver</div>
            </div>
          </div>

          <section className="complaints-list">
            {complaints.map((complaint) => (
              <article key={complaint.id} className={`complaint-card ${complaint.bgColor}`}>
                <div className="complaint-header">
                  <img 
                    alt={`Profile picture of ${complaint.name}`} 
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
              </article>
            ))}

            {/* Response Form */}
            <form className="response-form" onSubmit={handleSubmit}>
              <input 
                className="response-input" 
                placeholder="Add a response.." 
                type="text" 
              />
              <button className="response-btn" type="submit">
                SEND
              </button>
            </form>

            {/* Pagination */}
            <nav className="pagination">
              <span>Show</span>
              <select className="pagination-select">
                <option>4</option>
                <option>8</option>
                <option>12</option>
              </select>
              <span>per page</span>
              <span>1-4 of 10</span>
              <button className="pagination-arrow">←</button>
              <button className="pagination-number active">1</button>
              <button className="pagination-number">2</button>
              <button className="pagination-number">3</button>
              <button className="pagination-number">4</button>
              <button className="pagination-number">5</button>
              <button className="pagination-arrow">→</button>
            </nav>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ViewDriverComplaints;