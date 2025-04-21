import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import navImage from '../../Assets/LandingTOp.png';
import backgroundImage from '../../Assets/Frame 220.jpg';
import Achivement1 from '../../Assets/Achievement1.png';
import Achivement2 from '../../Assets/achievement2.png';
import Achivement3 from '../../Assets/achievement3.png';
import Achivement4 from '../../Assets/achievement4.png';
import landingimg1 from '../../Assets/landingimg1.png';
import landingimg2 from '../../Assets/landingimg2.png';
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

function LandingPage() {
  const [visibleAchievements, setVisibleAchievements] = useState([false, false, false, false]);

  useEffect(() => {
    const timers = visibleAchievements.map((_, index) => {
      return setTimeout(() => {
        setVisibleAchievements(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 1000);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

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
      <div className='achievements-container'>
        <div className='achievements'>
          {[Achivement1, Achivement2, Achivement3, Achivement4].map((achievement, index) => (
            <div
              key={index}
              className={`achievement-item ${visibleAchievements[index] ? 'visible' : ''}`}
            >
              <img src={achievement} alt="Achievement" />
              <p className="achievement-text">
                {index === 0 && '10,000+  REVIEWS'}
                {index === 1 && '50000 +CUSTOMERS'}
                {index === 2 && '10,000 +  DRIVERS'}
                {index === 3 && '10,000 + TRIPS'}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className='landing-content'>
        <div>
          <div>
            <img src={landingimg2} alt="24/7 Availability" />
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
            <img src={landingimg1} alt="Professional Drivers" />
          </div>

        </div>
      </div>
      <h1 className='vehicle'>OUR VEHICLES</h1>

      <div className='vehicle-container'>
        <div className='vehicle-item'>
          <img src={car1} alt="" />
          <h3>SEDAN</h3>
          <p>
            Ideal for individuals or small groups seeking a comfortable ride with ample luggage space. Up to 3 passengers
          </p>
        </div>
        <div className='vehicle-item'>
          <img src={car2} alt="" />
          <h3>MULTI PURPOSE VEHICLE</h3>
          <p>
            A versatile automobile designed to comfortably accommodate 5 to 8 passengers, making it ideal for families and group travel.
          </p>
        </div>
        <div className='vehicle-item'>
          <img src={car3} alt="" />
          <h3>SUV</h3>
          <p>
            Spacious and accommodating, perfect for families and extra legroom and generous cargo capacity. Up to 6 passengers.
          </p>
        </div>

      </div>

      <h1 className='service'>OUR SERVICES</h1>
      <div className='service-container'>
        <div className='service-item'>
          <img src={service4} alt="" />
          <h3>Local Rides</h3>
          <p>
          Quick and convenient rides across the city          </p>
        </div>
        <div className='service-item'>
          <img src={service3} alt="" />
          <h3>Airport Transfers</h3>
          <p>
          Stress-free airport transportation with professional drivers          </p>
        </div>
        <div className='service-item'>
          <img src={service2} alt="" />
          <h3>Wheelchair access</h3>
          <p>
          Wheelchair accessible rides available at any time       
          </p>
        </div>
        <div className='service-item'>
          <img src={service1} alt="" />
          <h3>City Tours</h3>
          <p>
          Explore famous landmarks and scenic spots with our tour service             </p>
        </div>

      </div>
      <h1 className='customer-title'>WHAT OUR <span>CUSTOMERS</span> SAY!</h1>
<div className='customer-say'>
  <div>
    <div>
      <Avatar
        alt="Customer 1"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR669WGc6vMrznWkxEUE5JBQV1zNib9Kwfd9g&s"
        sx={{ width: 60, height: 60 }}
      />
      <div className="customer-info">
        <span className="customer-name">John D.</span>
        <Rating name="size-large" defaultValue={5} size="large" readOnly/>
      </div>
    </div>
    <p>"The best ride service I've ever used. Always on time and professional drivers!"</p>
  </div>
  
  <div>
    <div>
      <Avatar
        alt="Customer 2"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6B8Z8-ufwTLvAi-C4oIPZG_mks_07Rgy4zA&s"
        sx={{ width: 60, height: 60 }}
      />
      <div className="customer-info">
        <span className="customer-name">Sarah M.</span>
        <Rating name="size-large" defaultValue={4} size="large" readOnly/>
      </div>
    </div>
    <p>"Excellent service for airport transfers. Will definitely use again."</p>
  </div>
  
  <div>
    <div>
      <Avatar
        alt="Customer 3"
        src="https://cdn.koreatraveleasy.com/wp-content/uploads/2020/04/24162747/time-on-me-studio-customer-photo1-442x590.jpg"
        sx={{ width: 60, height: 60 }}
      />
      <div className="customer-info">
        <span className="customer-name">Michael T.</span>
        <Rating name="size-large" defaultValue={5} size="large" readOnly />
      </div>
    </div>
    <p>"The wheelchair accessible vehicle was perfect for my needs. Very comfortable."</p>
  </div>
  
  <div>
    <div>
      <Avatar
        alt="Customer 4"
        src="https://passure.ai/_next/image?url=https%3A%2F%2Fgcs.beautyplus.com%2F3c14e8a1efc220ac6dee0ad999769023.jpeg&w=750&q=75"
        sx={{ width: 60, height: 60 }}
      />
      <div className="customer-info">
        <span className="customer-name">Lisa K.</span>
        <Rating name="size-large" defaultValue={4} size="large" readOnly/>
      </div>
    </div>
    <p>"Great city tour experience with knowledgeable drivers. Highly recommend!"</p>
  </div>
</div>   
<Footer/> 
</div>
  );
}

export default LandingPage;