import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverRegistration from './Components/driver/DriverRegistration'
import RideRegistration from './Components/Rider/RiderRegistration';
import AdminLogin from './Components/admin/AdminLogin';

function App() {
  return (
    <div>
      <Router>
        <Routes>
{/* Admin Route */}
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/driver-registration" element={<DriverRegistration />} />
          <Route path="/User-registration" element={<RideRegistration />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App