import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import navImage from '../../Assets/LandingTOP.png';
import backgroundImage from '../../Assets/RiderHomePage.png';
import landingimg1 from '../../Assets/Rider img.png';
import service1 from '../../Assets/Service1.png';
import service2 from '../../Assets/Service2.png';
import service3 from '../../Assets/Service3.png';
import service4 from '../../Assets/Service4.png';
import car1 from '../../Assets/car1.png';
import car2 from '../../Assets/car2.png';
import car3 from '../../Assets/car3.png';
import RiderViewProfile from './RiderViewProfile';
import '../Style/LandingPage.css';
import { Link } from 'react-router-dom';
import Footer from '../Common/Footer';
import RiderNav from './RiderNav';
import { ClickAwayListener } from '@mui/material';
import RiderEditProfile from './RiderEditProfile'
import apiService from '../../Services/apiService'

function RiderHomePage() {
    const riderData = (localStorage.getItem("riderToken"));
    console.log(riderData);

    const [showProfileCard, setShowProfileCard] = useState(false);
    const onAvatarClick = () => {
        setShowProfileCard(prev => !prev);
        if (!showProfileCard) {
            setShowProfileEditCard(false);
        }
    };

    const [showProfileEditCard, setShowProfileEditCard] = useState(false);
    const onEditClick = () => {
        setShowProfileEditCard(true);
        setShowProfileCard(false);
    };
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userData = await apiService.getCurrentUser();
                console.log(userData);
                setCurrentUser(userData.data.user);
            } catch (err) {
                console.log(err);
            }
        };

        fetchCurrentUser();
    }, []);

    console.log(currentUser);

    return (
        <div className="landing-container">
            <RiderNav onAvatarClick={onAvatarClick} />
            <div className='landing-bg'>
                <div className="bg-image-container">

                    <img src={backgroundImage} alt="Background" className='bg-image' />
                    <h1 className="bg-text">YOUR RIDE ON TIME EVERY TIME</h1>
                </div>

            </div>
            <h1 className='service'>OUR SERVICES</h1>
            <div className='service-container'>
                <div className='service-item'>
                    <img src={service4} alt="" />
                    <h3>Local Rides</h3>
                    <p>
                        Quick and convenient rides across the city
                    </p>
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


            <div className='landing-content'>
                <div>
                    <div>
                        <h3>Your journey, our priority.</h3>
                        <h2>Ride with Confidence</h2>
                        <p>At our RIDE SHARE, we believe every ride should be more than just transportation—it should be a reliable, comfortable, and safe experience. At every turn, in every mile, we’re committed to making your journey smooth, safe, and stress-free. Because when you ride with us, your journey becomes our top priority. From the moment you book to the moment you arrive at your destination, your journey is our top priority. Whether you're heading to the airport, commuting to work, or exploring the city, we’re committed to getting you there on time, every time, with friendly service and dependable drivers. Our fleet is regularly maintained to ensure a smooth ride, and our drivers are trained to deliver not just a trip, but a quality experience. With easy booking options, real-time tracking, and 24/7 customer support, we’re always just a call or click away. Ride with confidence, knowing we’re here to make every mile count.</p>
                    </div>
                    <div>
                        <img src={landingimg1} alt="Professional Drivers" style={{ position: "relative", top: "55px" }} />
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
                            <Rating name="size-large" defaultValue={5} size="large" readOnly />
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
                            <Rating name="size-large" defaultValue={4} size="large" readOnly />
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
                            <Rating name="size-large" defaultValue={4} size="large" readOnly />
                        </div>
                    </div>
                    <p>"Great city tour experience with knowledgeable drivers. Highly recommend!"</p>
                </div>
            </div>
            {showProfileCard && (
                <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                    <div style={{ position: "absolute", top: "40px", right: "20px" }}>
                        <RiderViewProfile
                            onEditClick={onEditClick}
                            currentUser={currentUser}
                        />
                    </div>
                </ClickAwayListener>
            )}
            {showProfileEditCard && (
                <ClickAwayListener onClickAway={() => setShowProfileEditCard(false)}>
                    <div style={{ position: "absolute", top: "10vh", left: "250px", backgroundColor: "white", zIndex: "5", borderRadius: "25px" }}>
                        <RiderEditProfile
                            setShowProfileEditCard={setShowProfileEditCard}
                            currentUser={currentUser}
                            setCurrentUser={setCurrentUser}
                        />
                    </div>
                </ClickAwayListener>
            )}
            <Footer />
        </div>
    );
}

export default RiderHomePage;