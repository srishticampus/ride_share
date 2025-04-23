import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import RideRegistration from "./Components/Rider/RiderRegistration";
import AdminLogin from "./Components/Admin/AdminLogin";
import 'react-toastify/dist/ReactToastify.css';
import ViewDriver from "./Components/Admin/ViewDriver";
import DriverLogin from "./Components/Driver/DriverLogin";
import RiderLogin from "./Components/Rider/RiderLogin";
import LandingPage from "./Components/Common/LandingPage";
import ViewRider from "./Components/Admin/ViewRider";
import DriverRegistration from "./Components/Driver/DriverRegistration";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import RiderHomePage from "./Components/Rider/RiderHomePage";
import DriverViewProfile from "./Components/Driver/DriverViewProfile";
import AboutUs from "./Components/Common/AboutUs";
import ContactUs from "./Components/Common/ContactUs";
import  RiderEditProfile  from "./Components/Rider/RiderEditProfile";
import RiderViewProfile from "./Components/Rider/RiderViewProfile";
import ViewRide from "./Components/Rider/ViewRide";
import RiderForgotPass from "./Components/Rider/RiderForgotPass";
import RiderResetPass from "./Components/Rider/RiderResetPass";
import DriverResetPass from "./Components/Driver/DriverResetPass";
import DriverForgotPass from "./Components/Driver/DriverForgotPass";
import RiderPayment from "./Components/Rider/RiderPayment";
import ViewDriverComplaints from "./Components/Admin/ViewDriverComplaints";

function App() {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Router basename="ride_share">
        <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />




          {/* Admin Route */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-view-driver" element={<ViewDriver />} />
          <Route path="/admin-view-riders" element={<ViewRider />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-driver-complaints" element={<ViewDriverComplaints />} />


          {/* Driver Route */}
          <Route path="/driver-registration" element={<DriverRegistration />} />
          <Route path="/driver-login" element={<DriverLogin />} />
          <Route path="/driver-profile" element={<DriverViewProfile />} />
          <Route path="/driver-forgot-pass" element={<DriverForgotPass/>}/>
          <Route path="/driver-Reset-Pass/:phoneNumber" element={<DriverResetPass />} />



          {/* User Route */}
          <Route path="/User-registration" element={<RideRegistration />} />
          <Route path="/User-login" element={<RiderLogin />} />
          <Route path="/User-forgot-pass" element={<RiderForgotPass/>}/>
          <Route path="/User-Reset-Pass/:phoneNumber" element={<RiderResetPass />} />
          <Route path="/User-paymet" element={<RiderPayment />} />
          <Route path="/User-home-page" element={<RiderHomePage />} />
          <Route path="/User-profile" element={<RiderViewProfile/>} />
          <Route path="/User-Edit-profile" element={<RiderEditProfile />} />
          <Route path="/User-View-Ride" element={<ViewRide />} />



        </Routes>
      </Router>
    </div>
  );
}

export default App;
