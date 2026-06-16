import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function VenueOwnerDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/venues', { headers });
      setVenues(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {user?.name} 👋</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#4f46e5', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>My Venues</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{venues.length}</p>
        </div>
        <div style={{ background: '#10b981', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>Total Capacity</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{venues.reduce((sum, v) => sum + v.capacity, 0)}</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px' }}>My Venues</h2>
      {venues.length === 0 ? (
        <p style={{ color: '#666' }}>No venues listed yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {venues.map(venue => (
            <div key={venue._id} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{venue.name}</h3>
              <p style={{ color: '#666', margin: '0 0 4px 0' }}>📍 {venue.location}</p>
              <p style={{ color: '#666', margin: '0 0 4px 0' }}>👥 Capacity: {venue.capacity}</p>
              <p style={{ color: '#4f46e5', fontWeight: '700', margin: '8px 0 0 0' }}>${venue.price}/day</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VenueOwnerDashboard;