import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import RideRegistration from "./Components/Rider/RiderRegistration";
import AdminLogin from "./Components/Admin/AdminLogin";
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
import RiderEditProfile from "./Components/Rider/RiderEditProfile";
import RiderViewProfile from "./Components/Rider/RiderViewProfile";
import ViewRide from "./Components/Rider/ViewRide";
import RiderForgotPass from "./Components/Rider/RiderForgotPass";
import RiderResetPass from "./Components/Rider/RiderResetPass";
import DriverResetPass from "./Components/Driver/DriverResetPass";
import DriverForgotPass from "./Components/Driver/DriverForgotPass";
import RiderPayment from "./Components/Rider/RiderPayment";
import ViewDriverComplaints from "./Components/Admin/ViewComplaints";
import DriverHomePage from "./Components/Driver/DriverHomePage";
import DriverEditProfile from "./Components/Driver/DriverEditProfile";
import AddVehicle from "./Components/Driver/AddVehicle";
import AddRide from "./Components/Driver/AddRide";
import AddComplaints from "./Components/Driver/AddComplaints";
import ViewRequest from "./Components/Driver/ViewRequest";
import DriverRequests from "./Components/Admin/DriverRequests";
import RiderComplaints from "./Components/Rider/RiderComplaints";
import ViewComplaints from "./Components/Admin/ViewComplaints";
import RideHistory from "./Components/Admin/RideHistory";
import FeedBacks from "./Components/Admin/FeedBacks";
import RiderRideHistory from "./Components/Rider/RiderRideHistory";
import RiderReview from "./Components/Rider/RiderReview";
import DriverRideHistory from "./Components/Driver/DriverRideHistory";
import DriverPaymentHistory from "./Components/Driver/DriverPaymentHistory";
import ContactUsAdmin from "./Components/Admin/ContactUsAdmin";
const NavigationHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Ensure browser navigation works
    const unblock = window.addEventListener('popstate', () => {
      navigate(location.pathname, { replace: true });
    });

    return () => {
      window.removeEventListener('popstate', unblock);
    };
  }, [navigate, location]);

  return null;
};

function App() {
  return (
    <div>
      
      <Router basename="/ride_share">
        <NavigationHandler />
        <Routes>
          {/* Common Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-all-drivers" element={<DriverRequests />} />
          <Route path="/admin-view-driver" element={<ViewDriver />} />
          <Route path="/admin-view-riders" element={<ViewRider />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-driver-complaints" element={<ViewDriverComplaints />} />
          <Route path="/admin-complaints" element={<ViewComplaints />} />
          <Route path="/admin-ride-history" element={<RideHistory />} />
          <Route path="/admin-feedback" element={<FeedBacks />} />
          <Route path="/admin-ContactUs" element={<ContactUsAdmin />} />

          {/* Driver Routes */}
          <Route path="/driver-registration" element={<DriverRegistration />} />
          <Route path="/driver-login" element={<DriverLogin />} />
          <Route path="/driver-home-page" element={<DriverHomePage />} />
          <Route path="/driver-profile" element={<DriverViewProfile />} />
          <Route path="/driver-edit-profile" element={<DriverEditProfile />} />
          <Route path="/driver-forgot-pass" element={<DriverForgotPass />} />
          <Route path="/driver-Reset-Pass/:phoneNumber" element={<DriverResetPass />} />
          <Route path="/driver-Add-Vehicle" element={<AddVehicle />} />
          <Route path="/driver-Add-Ride" element={<AddRide />} />
          <Route path="/driver-Add-complaints" element={<AddComplaints />} />
          <Route path="/driver-View-Requets" element={<ViewRequest />} />
          <Route path="/driver-View-history" element={<DriverRideHistory />} />
          <Route path="/driver-View-PaymentHistory" element={<DriverPaymentHistory />} />

          {/* Rider Routes */}
          <Route path="/User-registration" element={<RideRegistration />} />
          <Route path="/User-login" element={<RiderLogin />} />
          <Route path="/User-forgot-pass" element={<RiderForgotPass />} />
          <Route path="/User-Reset-Pass/:phoneNumber" element={<RiderResetPass />} />
          <Route path="/User-payment" element={<RiderPayment />} />
          <Route path="/User-home-page" element={<RiderHomePage />} />
          <Route path="/User-profile" element={<RiderViewProfile />} />
          <Route path="/User-Edit-profile" element={<RiderEditProfile />} />
          <Route path="/User-View-Ride" element={<ViewRide />} />
          <Route path="/User-Complaints" element={<RiderComplaints />} />
          <Route path="/User-ride-History" element={<RiderRideHistory />} />
          <Route path="/User-review-ride" element={<RiderReview />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;