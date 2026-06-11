import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import OrganizerDashboard from './pages/OrganiserDashboard';
import Events from './pages/Events';
import Venues from './pages/Venues';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/organizer" element={<OrganizerDashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/venues" element={<Venues />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;