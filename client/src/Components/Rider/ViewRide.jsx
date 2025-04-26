import React from 'react';
import { FaUserCircle, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import '../Style/ViewRide.css'
import image from '../../Assets/car4.png'
import RiderNav from './RiderNav';
import RiderSearch from './RiderSearch';

const ViewRide = () => {
  return (
    <div className="view-ride-container">
      <RiderNav/>

      <main className="view-ride-main">
        <h1 className="view-ride-title">RIDE</h1>
        <div className="view-ride-header">
          <div className="view-ride-subtitle">VIEW RIDES</div>
          <RiderSearch/>
        </div>

        <section className="view-ride-grid">
          {[...Array(100)].map((_, index) => (
            <article key={index} className="view-ride-card">
              <img 
                alt="Yellow taxi car on city street with buildings in background" 
                className="view-ride-image" 
                src={image}
              />
              <div className="view-ride-details">
                <div className="view-ride-time">
                  <span>10:15 AM</span>
                  <span>Sun, Apr 15</span>
                </div>
                <p className="view-ride-pickup">Pick Up at The 123 City</p>
                <p className="view-ride-dropoff">
                  <FaMapMarkerAlt className="view-ride-marker" />
                  Drop Off: New City
                </p>
                <button className="view-ride-button">View Details</button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ViewRide;