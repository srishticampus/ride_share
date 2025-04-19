import React, { useEffect, useState } from 'react';
import navImage from '../../Assets/LandingTOp.png';
import backgroundImage from '../../Assets/Frame 220.jpg';
import Achivement1 from '../../Assets/Achievement1.png';
import Achivement2 from '../../Assets/achievement2.png';
import Achivement3 from '../../Assets/achievement3.png';
import Achivement4 from '../../Assets/achievement4.png';
import landingimg1 from '../../Assets/landingimg1.png';
import landingimg2 from '../../Assets/landingimg2.png';
import '../Style/LandingPage.css';
import { Link } from 'react-router-dom';

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
      }, index * 300);
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
          <img src={landingimg1} alt="" />
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur dolores recusandae deleniti laborum assumenda saepe numquam? Unde eos, vitae magni minus veniam voluptates quasi odio officia odit cum a quaerat cupiditate. Blanditiis cumque perferendis dolorem exercitationem quasi sed enim quas, nemo voluptatem saepe qui porro minus nesciunt nobis nihil eaque, quisquam veniam! Qui ipsum consequatur eligendi minima maxime. Veritatis, sed?
        </div>
        </div>
       
      </div> 
      <div className='landing-content'>
        <div>
        <div>
          <img src={landingimg1} alt="" />
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur dolores recusandae deleniti laborum assumenda saepe numquam? Unde eos, vitae magni minus veniam voluptates quasi odio officia odit cum a quaerat cupiditate. Blanditiis cumque perferendis dolorem exercitationem quasi sed enim quas, nemo voluptatem saepe qui porro minus nesciunt nobis nihil eaque, quisquam veniam! Qui ipsum consequatur eligendi minima maxime. Veritatis, sed?
        </div>
        </div>
       
      </div> 
         </div>
  );
}

export default LandingPage;