import React from 'react';
import Logo from "../../Assets/Logo.png";
import '../Style/Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src={Logo} alt="RideShare Logo" className="logo-img-footer" />
                    <div className="social-icons">
                        <a href="#" aria-label="Facebook"><FaFacebook className="icon" /></a>
                        <a href="#" aria-label="Twitter"><FaTwitter className="icon" /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram className="icon" /></a>
                        <a href="#" aria-label="YouTube"><FaYoutube className="icon" /></a>
                        <a href="#" aria-label="WhatsApp"><FaWhatsapp className="icon" /></a>
                    </div>
                </div>
                
                <div className="footer-section">
                    <h2 className="footer-heading">QUICK LINKS</h2>
                    <ul className="footer-links">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">BOOK RIDE</a></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h2 className="footer-heading">TERMS & POLICIES</h2>
                    <ul className="footer-links">
                        <li><a href="#">Terms of Condition</a></li>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h2 className="footer-heading">GET IN TOUCH</h2>
                    <ul className="footer-links">
                        <li><a href="tel:04712578303">0471-2578303</a></li>
                        <li><a href="mailto:rideshare@gmail.com">rideshare@gmail.com</a></li>
                    </ul>
                </div>
                
            </div>

            {/* <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} RideShare. All Rights Reserved.</p>
            </div> */}
            
        </footer>
    );
}

export default Footer;