import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function OrganizerDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [stats, setStats] = useState({ events: 0, guests: 0, tasks: 0, vendors: 0 });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [eventsRes, guestsRes, tasksRes, vendorsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/events', { headers }),
        axios.get('http://localhost:5000/api/guests', { headers }),
        axios.get('http://localhost:5000/api/tasks', { headers }),
        axios.get('http://localhost:5000/api/vendors', { headers }),
      ]);
      setStats({
        events: eventsRes.data.length,
        guests: guestsRes.data.length,
        tasks: tasksRes.data.length,
        vendors: vendorsRes.data.length,
      });
    } catch (error) {
      console.log('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {user?.name} 👋</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#4f46e5', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>Events</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.events}</p>
        </div>
        <div style={{ background: '#7c3aed', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>Guests</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.guests}</p>
        </div>
        <div style={{ background: '#0891b2', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>Tasks</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.tasks}</p>
        </div>
        <div style={{ background: '#059669', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>Vendors</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.vendors}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', cursor: 'pointer' }}
          onClick={() => navigate('/events')}>
          <h3>📅 Events</h3>
          <p style={{ color: '#666', marginTop: '8px' }}>Create and manage your events</p>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', cursor: 'pointer' }}
          onClick={() => navigate('/venues')}>
          <h3>🏛️ Venues</h3>
          <p style={{ color: '#666', marginTop: '8px' }}>Browse and book venues</p>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', cursor: 'pointer' }}
          onClick={() => navigate('/guests')}>
          <h3>👥 Guests</h3>
          <p style={{ color: '#666', marginTop: '8px' }}>Manage guest list and RSVPs</p>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', cursor: 'pointer' }}
          onClick={() => navigate('/tasks')}>
          <h3>✅ Tasks</h3>
          <p style={{ color: '#666', marginTop: '8px' }}>Track tasks and assignments</p>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', cursor: 'pointer' }}
          onClick={() => navigate('/vendors')}>
          <h3>🚚 Vendors</h3>
          <p style={{ color: '#666', marginTop: '8px' }}>Manage vendor requests</p>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', cursor: 'pointer' }}
          onClick={() => navigate('/staff')}>
          <h3>👷 Staff</h3>
          <p style={{ color: '#666', marginTop: '8px' }}>Manage your team</p>
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;