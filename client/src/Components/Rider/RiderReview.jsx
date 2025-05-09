import React from 'react'
import RiderNav from '../Rider/RiderNav'
import '../Style/FeedBacks.css'
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';

const feedbackData = [
  {
    id: 1,
    name: "Alan Paul",
    date: "30 JAN 2025",
    rating: 4,
    avatar: "/static/images/avatar/1.jpg",
    comment: "I had a great experience with this cab service! The driver arrived on time, the vehicle was clean and comfortable, and the ride was smooth and safe. The driver was polite, professional, and knew the best routes to avoid traffic."
  },
  {
    id: 2,
    name: "Sarah Johnson",
    date: "28 JAN 2025",
    rating: 5,
    avatar: "/static/images/avatar/2.jpg",
    comment: "Excellent service! The driver was very courteous and the car was spotless. I felt safe throughout the journey and will definitely use this service again."
  },
  {
    id: 3,
    name: "Michael Chen",
    date: "25 JAN 2025",
    rating: 3,
    avatar: "/static/images/avatar/3.jpg",
    comment: "Good overall experience, but the driver took a longer route which increased the fare. The car was clean and comfortable though."
  },
  {
    id: 4,
    name: "Emma Wilson",
    date: "22 JAN 2025",
    rating: 5,
    avatar: "/static/images/avatar/4.jpg",
    comment: "Perfect ride! The driver was on time, the car was luxurious, and the ride was smooth. Couldn't ask for better service."
  },
  {
    id: 5,
    name: "David Brown",
    date: "20 JAN 2025",
    rating: 2,
    avatar: "/static/images/avatar/5.jpg",
    comment: "The car was not very clean and the driver was rude. I expected better service for the price I paid."
  },
  {
    id: 6,
    name: "Priya Patel",
    date: "18 JAN 2025",
    rating: 4,
    avatar: "/static/images/avatar/6.jpg",
    comment: "Very good service overall. The driver was professional and the ride was comfortable. Would recommend to friends."
  },
  {
    id: 7,
    name: "James Wilson",
    date: "15 JAN 2025",
    rating: 5,
    avatar: "/static/images/avatar/7.jpg",
    comment: "Outstanding experience! The driver went above and beyond to ensure my comfort. The car was top-notch and the ride was perfect."
  },
  {
    id: 8,
    name: "Sophia Garcia",
    date: "12 JAN 2025",
    rating: 3,
    avatar: "/static/images/avatar/8.jpg",
    comment: "Average experience. The driver was late by 10 minutes and didn't apologize. The ride itself was fine though."
  },
  {
    id: 9,
    name: "Robert Lee",
    date: "10 JAN 2025",
    rating: 4,
    avatar: "/static/images/avatar/9.jpg",
    comment: "Good service overall. The car was clean and the driver was professional. Would use again."
  },
  {
    id: 10,
    name: "Olivia Martin",
    date: "8 JAN 2025",
    rating: 5,
    avatar: "/static/images/avatar/10.jpg",
    comment: "Fantastic experience from start to finish! The driver was early, the car was immaculate, and the ride was smooth. 10/10 would recommend."
  }
];

function RiderReview() {
    return (
        <div className="review-container">
          <RiderNav/>
            <div className="review-content">
                <h1 className="feedbacks-title"> REVIEWS</h1>

                <div className="feedbacks-grid">
                    {feedbackData.map((feedback) => (
                        <div key={feedback.id} className="feedback-card">
                            <div className="feedback-header">
                                <div className="user-info">
                                    <Avatar
                                        alt={feedback.name}
                                        src={feedback.avatar}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                    <div className="user-details">
                                        <b>{feedback.name}</b>
                                        <p>{feedback.date}</p>
                                    </div>
                                </div>
                                <Rating 
                                    name={`rating-${feedback.id}`} 
                                    value={feedback.rating} 
                                    readOnly 
                                    size="large" 
                                />
                            </div>
                            <div className="feedback-comment">
                                <p>{feedback.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RiderReview