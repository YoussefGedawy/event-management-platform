import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function GuestDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [myGuests, setMyGuests] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchMyInvitations();
  }, []);

  const fetchMyInvitations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/guests', { headers });
      setMyGuests(response.data.filter(g => g.email === user?.email));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRsvp = async (id, rsvpStatus) => {
    await axios.put(`http://localhost:5000/api/guests/${id}`, { rsvpStatus }, { headers });
    fetchMyInvitations();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const rsvpColors = {
    pending: '#f59e0b',
    attending: '#10b981',
    not_attending: '#ef4444',
    maybe: '#3b82f6'
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {user?.name} 👋</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
      </div>

      <h2 style={{ marginBottom: '16px' }}>My Invitations</h2>
      {myGuests.length === 0 ? (
        <p style={{ color: '#666' }}>No invitations yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {myGuests.map(guest => (
            <div key={guest._id} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{guest.event?.title || 'Event'}</h3>
              <p style={{ color: '#666', margin: '0 0 16px 0' }}>
                📅 {guest.event?.date ? new Date(guest.event.date).toLocaleDateString() : 'TBD'}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['attending', 'not_attending', 'maybe'].map(status => (
                  <button key={status}
                    onClick={() => handleRsvp(guest._id, status)}
                    style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
                      backgroundColor: guest.rsvpStatus === status ? rsvpColors[status] : '#f3f4f6',
                      color: guest.rsvpStatus === status ? 'white' : '#666' }}>
                    {status === 'attending' ? '✅ Attending' : status === 'not_attending' ? '❌ Not Attending' : '🤔 Maybe'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GuestDashboard;