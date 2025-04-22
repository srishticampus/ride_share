import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import navImage from '../../Assets/LandingTOP.png';
import backgroundImage from '../../Assets/AboutBg.png';
import about1 from '../../Assets/about1.png';
import about2 from '../../Assets/about2.png';
import car1 from '../../Assets/car1.png';
import car2 from '../../Assets/car2.png';
import car3 from '../../Assets/car3.png';
import service1 from '../../Assets/Service1.png';
import service2 from '../../Assets/Service2.png'; 
import service3 from '../../Assets/Service3.png';
import service4 from '../../Assets/Service4.png';   

import '../Style/LandingPage.css';
import { Link } from 'react-router-dom';
import Footer from './Footer';

function AboutUs() {
  return (
    <div className="landing-container">
      <div className='landing-nav'>
        <img src={navImage} alt="Navigation header" className='landing-nav-image' />
      </div>
      <div className='nav-links'>
        <div className="links-container">
          <Link to="/">HOME</Link>
          <Link to="/about">ABOUT US</Link>
          <Link to="/contact">CONTACT US</Link>
        </div>
      </div>
      <div className='landing-bg'>
        <div className="bg-image-container">
          <img src={backgroundImage} alt="Background" className='bg-image' />
          <h1 className="bg-text">YOUR RIDE ON TIME EVERY TIME</h1>
        </div>
      </div>
      <div className='landing-content'>
        <div>
          <div>
            <img src={about2} alt="24/7 Availability" />
          </div>
          <div>
            <h3>24/7 Availability</h3>
            <h2>Always Ready, Wherever You Are</h2>
            <p>Our drivers are available around the clock to ensure you reach your destination whenever you need to. Whether it’s an early morning airport run or a late-night ride home, we’re just a call or click away. No matter the time, location, or weather, we’re committed to getting you where you need to be safely and comfortably. With real-time tracking and quick response times, you can count on us day or night.</p>
          </div>
        </div>
      </div>

      <div className='landing-content'>
        <div>
          <div>
            <h3>Professional Drivers</h3>
            <h2>Ride with Confidence</h2>
            <p>Experienced and courteous drivers committed to providing a safe and comfortable journey for every passenger. Our team is thoroughly vetted, professionally trained, and dedicated to the highest standards of service. From navigating traffic to assisting with luggage, they go the extra mile to ensure your ride is smooth and stress-free. With local knowledge and a customer-first attitude, you’re in good hands every time you ride with us.</p>
          </div>
          <div>
            <img src={about1} alt="Professional Drivers" />
          </div>

        </div>
      </div>
      <h1 className='vehicle'>WHY CHOOSE US?</h1>

<div className='vehicle-container'>
    <div className='vehicle-item'>
        <svg width="53" height="53" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.2002 7.44995C17.9502 7.44995 11.2002 14.2 11.2002 22.45C11.2002 32.575 24.3252 44.0125 24.8877 44.575C25.2627 44.7625 25.8252 44.95 26.2002 44.95C26.5752 44.95 27.1377 44.7625 27.5127 44.575C28.0752 44.0125 41.2002 32.575 41.2002 22.45C41.2002 14.2 34.4502 7.44995 26.2002 7.44995ZM26.2002 40.6375C22.2627 36.8875 14.9502 28.825 14.9502 22.45C14.9502 16.2625 20.0127 11.2 26.2002 11.2C32.3877 11.2 37.4502 16.2625 37.4502 22.45C37.4502 28.6375 30.1377 36.8875 26.2002 40.6375ZM26.2002 14.95C22.0752 14.95 18.7002 18.325 18.7002 22.45C18.7002 26.575 22.0752 29.95 26.2002 29.95C30.3252 29.95 33.7002 26.575 33.7002 22.45C33.7002 18.325 30.3252 14.95 26.2002 14.95ZM26.2002 26.2C24.1377 26.2 22.4502 24.5125 22.4502 22.45C22.4502 20.3875 24.1377 18.7 26.2002 18.7C28.2627 18.7 29.9502 20.3875 29.9502 22.45C29.9502 24.5125 28.2627 26.2 26.2002 26.2Z" fill="black" />
        </svg>

        <h3>Reliable Service</h3>
        <p>
            Count on us to get you there on time, every time. With a vast network of drivers and cutting-edge technology, we guarantee a timely pick-up and an efficient route to your destination.                      </p>
    </div>
    <div className='vehicle-item'>
        <svg width="53" height="53" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.1998 3.27637L6.5498 9.82637V29.4764C6.5498 40.3299 15.3463 49.1264 26.1998 49.1264C37.0534 49.1264 45.8498 40.3299 45.8498 29.4764V9.82637L26.1998 3.27637ZM42.1654 29.4764C42.1654 38.2933 35.0167 45.442 26.1998 45.442C17.3829 45.442 10.2342 38.2933 10.2342 29.4764V12.5896L26.1998 6.96074L42.1654 12.5896V29.4764Z" fill="black" />
            <path d="M19.3636 24.3132C19.1929 24.1417 18.9899 24.0056 18.7664 23.9127C18.5429 23.8199 18.3033 23.772 18.0613 23.772C17.8193 23.772 17.5796 23.8199 17.3561 23.9127C17.1326 24.0056 16.9297 24.1417 16.759 24.3132C16.5874 24.484 16.4513 24.6869 16.3585 24.9104C16.2656 25.1339 16.2178 25.3735 16.2178 25.6155C16.2178 25.8576 16.2656 26.0972 16.3585 26.3207C16.4513 26.5442 16.5874 26.7471 16.759 26.9179L23.3806 33.5395L23.4881 33.647C23.6496 33.8088 23.8414 33.9372 24.0526 34.0247C24.2637 34.1123 24.4901 34.1574 24.7187 34.1574C24.9474 34.1574 25.1737 34.1123 25.3849 34.0247C25.5961 33.9372 25.7879 33.8088 25.9494 33.647L37.3863 22.2101C37.5481 22.0486 37.6765 21.8567 37.7641 21.6455C37.8517 21.4344 37.8968 21.208 37.8968 20.9794C37.8968 20.7508 37.8517 20.5244 37.7641 20.3132C37.6765 20.102 37.5481 19.9102 37.3863 19.7487L37.2431 19.6054C37.0815 19.4436 36.8897 19.3152 36.6785 19.2276C36.4674 19.1401 36.241 19.095 36.0124 19.095C35.7837 19.095 35.5574 19.1401 35.3462 19.2276C35.135 19.3152 34.9432 19.4436 34.7817 19.6054L24.7162 29.6658L19.3636 24.3132Z" fill="black" />
        </svg>

        <h3>Safety First</h3>
        <p>
            Your safety is our top priority. Our drivers are thoroughly vetted, and we have advanced tracking features to ensure a secure journey from start to finish.                      </p>
    </div>
    <div className='vehicle-item'>
        <svg width="53" height="53" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.931 18.5598H39.2977C39.2977 12.3657 33.2826 9.54048 28.381 8.88985V4.36816H24.0143V8.88985C19.1127 9.54048 13.0977 12.3657 13.0977 18.5598C13.0977 24.4679 18.9184 27.5399 24.0143 28.232V39.0832C20.8529 38.5351 17.4643 36.8474 17.4643 33.8432H13.0977C13.0977 39.4958 18.3922 42.8363 24.0143 43.5284V48.0348H28.381V43.5153C33.2826 42.8647 39.2977 40.0373 39.2977 33.8432C39.2977 27.649 33.2826 24.8238 28.381 24.1732V13.3198C31.2848 13.8416 34.931 15.3743 34.931 18.5598ZM17.4643 18.5598C17.4643 15.3743 21.1105 13.8416 24.0143 13.3198V23.7976C21.021 23.2453 17.4643 21.6099 17.4643 18.5598ZM34.931 33.8432C34.931 37.0286 31.2848 38.5613 28.381 39.0832V28.6032C31.2848 29.125 34.931 30.6577 34.931 33.8432Z" fill="black" />
        </svg>

        <h3>Affordable Rides</h3>
        <p>
            Experience premium service without breaking the bank. We consistently offer competitive prices, so you can get where you need to go without worrying the outrageous fares.                      </p>
    </div>

</div>
<h1 className='vehicle'>WHAT WE ARE OFFERING</h1>

<div className="offering-container"> 
  <div>
    <h2>24/7 Availability</h2>
    <p>Our abs run around the clock to ensure you can get where you need to go anytime anywhare </p>
  </div>
  <div>
    <h2>Safe & Professional Drivers</h2>
    <p>All our drivers are trained, background checking and committed to providing a safe and respectful experience</p>
  </div>
  <div>
  <h2>Clean & Comfortable Rides</h2>
<p>Our vehicles are thoroughly cleaned and routinely maintained to ensure a smooth, safe, and enjoyable journey every time you ride with us.</p>
  </div>
  <div>
    <h2>Affordable Pricing</h2>
    <p>Transparent, comoetitive rates with no hidden charges. Get premium service without the premium price.</p>
  </div>
</div>
   
 
<Footer/> 
</div>
  );
}

export default AboutUs;