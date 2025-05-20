import React, { useState, useEffect } from 'react';
import '../Style/FeedBacks.css';
import AdminNav from './AdminNav';
import AdminSidemenu from './AdminSidemenu';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import apiService from '../../Services/apiService';

function FeedBacks() {
  const [ratings, setRatings] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await apiService.getAllRatings();
      const receivedRatings = response?.data?.ratings || [];
      setRatings(receivedRatings);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setRatings([]);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="feedbacks-container">
      <AdminNav />
      <AdminSidemenu />
      <div className="feedbacks-content">
        <h1 className="feedbacks-title">FEEDBACKS</h1>

        <div className="feedbacks-grid">
          {ratings?.length > 0 ? (
            ratings.map((rating) => (
              <div key={rating._id} className="feedback-card">
                <div className="feedback-header">
                  <div className="user-info">
                    <Avatar
                      alt={rating.reviewerId?.fullName || 'Anonymous'}
                      src={`http://localhost:4052/ride_share_api${rating.reviewerId?.profilePicture}`}
                      sx={{ width: 56, height: 56 }}
                    />
                    
                    <div className="user-details">
                      <b>{rating.reviewerId?.fullName || 'Anonymous'}</b>
                      <p>{formatDate(rating.createdAt)}</p>
                    </div>
                  </div>
                  <Rating 
                    name={`rating-${rating._id}`} 
                    value={rating.rating} 
                    readOnly 
                    size="large" 
                    precision={0.5}
                  />
                </div>
                <div className="feedback-comment">
                  <p>{rating.reviewText || 'No review text provided'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-reviews-message">
              <p>No reviews available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedBacks;