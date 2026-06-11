import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Events() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState('planning');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchEvents();
  }, []);

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
      if (editingEvent) {
        await axios.put(`http://localhost:5000/api/events/${editingEvent._id}`,
          { title, description, date, budget, status }, { headers });
      } else {
        await axios.post('http://localhost:5000/api/events',
          { title, description, date, budget, status }, { headers });
      }
      fetchEvents();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description || '');
    setDate(event.date.substring(0, 10));
    setBudget(event.budget || '');
    setStatus(event.status);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await axios.delete(`http://localhost:5000/api/events/${id}`, { headers });
    fetchEvents();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setDate('');
    setBudget('');
    setStatus('planning');
    setError('');
  };

  const statusColors = {
    planning: '#f59e0b',
    confirmed: '#3b82f6',
    completed: '#10b981',
    cancelled: '#ef4444'
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
          <h1 style={{ margin: 0 }}>📅 Events</h1>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          + New Event
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '20px' }}>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
          {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event title" required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Date *</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Budget ($)</label>
                <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)}
                  placeholder="0"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}>
                  <option value="planning">Planning</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event description" rows={3}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit"
                style={{ padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                {editingEvent ? 'Save Changes' : 'Create Event'}
              </button>
              <button type="button" onClick={resetForm}
                style={{ padding: '10px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <p style={{ fontSize: '48px' }}>📅</p>
          <p>No events yet. Create your first event!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {events.map(event => (
            <div key={event._id}
              style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0 }}>{event.title}</h3>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: statusColors[event.status] + '20', color: statusColors[event.status] }}>
                    {event.status}
                  </span>
                </div>
                <p style={{ color: '#666', margin: '0 0 4px 0' }}>
                  📅 {new Date(event.date).toLocaleDateString()}
                  {event.budget > 0 && <span style={{ marginLeft: '16px' }}>💰 ${event.budget}</span>}
                </p>
                {event.description && <p style={{ color: '#999', margin: 0, fontSize: '14px' }}>{event.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(event)}
                  style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(event._id)}
                  style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;