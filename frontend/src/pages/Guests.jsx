import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Guests() {
  const [guests, setGuests] = useState([]);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eventId, setEventId] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [filterRsvp, setFilterRsvp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchGuests();
    fetchEvents();
  }, []);

  const fetchGuests = async (evId = '', rsvp = '') => {
    try {
      const params = {};
      if (evId) params.eventId = evId;
      if (rsvp) params.rsvpStatus = rsvp;
      const response = await axios.get('http://localhost:5000/api/guests', { headers, params });
      setGuests(response.data);
    } catch (error) {
      console.log('Error fetching guests:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events', { headers });
      setEvents(response.data);
    } catch (error) {
      console.log('Error fetching events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/guests',
        { name, email, event: eventId, dietaryPreference }, { headers });
      fetchGuests();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleRsvpUpdate = async (id, rsvpStatus) => {
    await axios.put(`http://localhost:5000/api/guests/${id}`, { rsvpStatus }, { headers });
    fetchGuests(filterEvent, filterRsvp);
  };

  const handleCheckIn = async (id, checkedIn) => {
    await axios.put(`http://localhost:5000/api/guests/${id}`, { checkedIn: !checkedIn }, { headers });
    fetchGuests(filterEvent, filterRsvp);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this guest?')) return;
    await axios.delete(`http://localhost:5000/api/guests/${id}`, { headers });
    fetchGuests(filterEvent, filterRsvp);
  };

  const handleFilter = () => {
    fetchGuests(filterEvent, filterRsvp);
  };

  const resetForm = () => {
    setShowForm(false);
    setName(''); setEmail(''); setEventId(''); setDietaryPreference('');
    setError('');
  };

  const rsvpColors = {
    pending: '#f59e0b',
    attending: '#10b981',
    not_attending: '#ef4444',
    maybe: '#3b82f6'
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <button onClick={() => navigate('/dashboard/organizer')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', marginBottom: '8px' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ margin: 0 }}>👥 Guests</h1>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          + Add Guest
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <option value="">All Events</option>
          {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
        </select>
        <select value={filterRsvp} onChange={(e) => setFilterRsvp(e.target.value)}
          style={{ width: '180px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <option value="">All RSVP Status</option>
          <option value="pending">Pending</option>
          <option value="attending">Attending</option>
          <option value="not_attending">Not Attending</option>
          <option value="maybe">Maybe</option>
        </select>
        <button onClick={handleFilter}
          style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Filter
        </button>
        <button onClick={() => { setFilterEvent(''); setFilterRsvp(''); fetchGuests(); }}
          style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Clear
        </button>
      </div>

      {/* Add Guest Form */}
      {showForm && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '20px' }}>Add New Guest</h2>
          {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="Guest name"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="guest@email.com"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Event *</label>
                <select value={eventId} onChange={(e) => setEventId(e.target.value)} required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}>
                  <option value="">Select event</option>
                  {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Dietary Preference</label>
                <input value={dietaryPreference} onChange={(e) => setDietaryPreference(e.target.value)}
                  placeholder="Vegetarian, Vegan, Halal..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit"
                style={{ padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Add Guest
              </button>
              <button type="button" onClick={resetForm}
                style={{ padding: '10px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guests Table */}
      {guests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <p style={{ fontSize: '48px' }}>👥</p>
          <p>No guests yet. Add your first guest!</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Event</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>RSVP</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Dietary</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Checked In</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr key={guest._id} style={{ borderBottom: index < guests.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{guest.name}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{guest.email}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{guest.event?.title || 'N/A'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select value={guest.rsvpStatus}
                      onChange={(e) => handleRsvpUpdate(guest._id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd',
                        backgroundColor: rsvpColors[guest.rsvpStatus] + '20',
                        color: rsvpColors[guest.rsvpStatus], fontWeight: '600', fontSize: '13px' }}>
                      <option value="pending">Pending</option>
                      <option value="attending">Attending</option>
                      <option value="not_attending">Not Attending</option>
                      <option value="maybe">Maybe</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#666', fontSize: '14px' }}>{guest.dietaryPreference || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleCheckIn(guest._id, guest.checkedIn)}
                      style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        backgroundColor: guest.checkedIn ? '#d1fae5' : '#f3f4f6',
                        color: guest.checkedIn ? '#059669' : '#666', fontWeight: '600', fontSize: '13px' }}>
                      {guest.checkedIn ? '✅ Yes' : '⬜ No'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleDelete(guest._id)}
                      style={{ padding: '4px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Guests;