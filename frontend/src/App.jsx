import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import OrganizerDashboard from './pages/OrganiserDashboard';
import StaffDashboard from './pages/StaffDashboard';
import VendorDashboard from './pages/VendorDashboard';
import GuestDashboard from './pages/GuestDashboard';
import VenueOwnerDashboard from './pages/VenueOwnerDashboard';
import Events from './pages/Events';
import Venues from './pages/Venues';
import Guests from './pages/Guests';
import Tasks from './pages/Tasks';
import Vendors from './pages/Vendors';
import Staff from './pages/Staff';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/organizer" element={<OrganizerDashboard />} />
        <Route path="/dashboard/staff" element={<StaffDashboard />} />
        <Route path="/dashboard/vendor" element={<VendorDashboard />} />
        <Route path="/dashboard/guest" element={<GuestDashboard />} />
        <Route path="/dashboard/venue_owner" element={<VenueOwnerDashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/guests" element={<Guests />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/staff" element={<Staff />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;