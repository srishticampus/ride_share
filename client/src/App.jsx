import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import RideRegistration from "./Components/Rider/RiderRegistration";
import AdminLogin from "./Components/Admin/AdminLogin";
import 'react-toastify/dist/ReactToastify.css';
import DriverRegistration from "./Components/driver/DriverRegistration";
import ViewDriver from "./Components/Admin/ViewDriver";
import DriverLogin from "./Components/Driver/DriverLogin";
import RiderLogin from "./Components/Rider/RiderLogin";
import LandingPage from "./Components/Common/LandingPage";

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
      <Router>
        <Routes>
        <Route path="/" element={<LandingPage />} />



          {/* Admin Route */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-view-driver" element={<ViewDriver />} />
          {/* Driver Route */}
          <Route path="/driver-registration" element={<DriverRegistration />} />
          <Route path="/driver-login" element={<DriverLogin />} />

          {/* User Route */}
          <Route path="/User-registration" element={<RideRegistration />} />
          <Route path="/User-login" element={<RiderLogin />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
