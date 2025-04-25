import React from 'react';
import { FaUserCircle, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import '../Style/ViewRide.css'
import image from '../../Assets/car4.png'
import RiderNav from './RiderNav';
import RiderSearch from './RiderSearch';
const ViewRide = () => {
  return (
    <div className="ride-share-app">
   <RiderNav/>

      <main className="main-content">
        <h1 className="main-title">RIDE</h1>
        <div className="rides-header">
          <div className="rides-title">VIEW RIDES</div>
          <RiderSearch/>
        </div>

        <section className="rides-grid">
          {[...Array(100)].map((_, index) => (
            <article key={index} className="ride-card">
              <img 
                alt="Yellow taxi car on city street with buildings in background" 
                className="ride-image" 
                src={image}
              />
              <div className="ride-details">
                <div className="ride-time">
                  <span>10:15 AM</span>
                  <span>Sun, Apr 15</span>
                </div>
                <p className="ride-pickup">Pick Up at The 123 City</p>
                <p className="ride-dropoff">
                  <FaMapMarkerAlt className="marker-icon" />
                  Drop Off: New City
                </p>
                <button className="view-details-btn">View Details</button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ViewRide;