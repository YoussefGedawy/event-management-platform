import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Venues() {
  const [venues, setVenues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCapacity, setSearchCapacity] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async (loc = '', cap = '') => {
    try {
      const params = {};
      if (loc) params.location = loc;
      if (cap) params.capacity = cap;
      const response = await axios.get('http://localhost:5000/api/venues', { headers, params });
      setVenues(response.data);
    } catch (error) {
      console.log('Error fetching venues:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVenues(searchLocation, searchCapacity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingVenue) {
        await axios.put(`http://localhost:5000/api/venues/${editingVenue._id}`,
          { name, location, capacity, price, description, amenities }, { headers });
      } else {
        await axios.post('http://localhost:5000/api/venues',
          { name, location, capacity, price, description, amenities }, { headers });
      }
      fetchVenues();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setName(venue.name);
    setLocation(venue.location);
    setCapacity(venue.capacity);
    setPrice(venue.price);
    setDescription(venue.description || '');
    setAmenities(venue.amenities || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this venue?')) return;
    await axios.delete(`http://localhost:5000/api/venues/${id}`, { headers });
    fetchVenues();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingVenue(null);
    setName(''); setLocation(''); setCapacity('');
    setPrice(''); setDescription(''); setAmenities('');
    setError('');
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
          <h1 style={{ margin: 0 }}>🏛️ Venues</h1>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          + Add Venue
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}
          placeholder="Search by location..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
        <input type="number" value={searchCapacity} onChange={(e) => setSearchCapacity(e.target.value)}
          placeholder="Min capacity..."
          style={{ width: '160px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
        <button type="submit"
          style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Search
        </button>
        <button type="button" onClick={() => { setSearchLocation(''); setSearchCapacity(''); fetchVenues(); }}
          style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Clear
        </button>
      </form>

      {/* Form */}
      {showForm && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '20px' }}>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h2>
          {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="Venue name"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Location *</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} required
                  placeholder="City, Country"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Capacity *</label>
                <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required
                  placeholder="Max guests"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Price per day ($) *</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required
                  placeholder="0"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Amenities</label>
                <input value={amenities} onChange={(e) => setAmenities(e.target.value)}
                  placeholder="WiFi, Parking, Catering..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Description</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit"
                style={{ padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                {editingVenue ? 'Save Changes' : 'Add Venue'}
              </button>
              <button type="button" onClick={resetForm}
                style={{ padding: '10px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Venues List */}
      {venues.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <p style={{ fontSize: '48px' }}>🏛️</p>
          <p>No venues yet. Add your first venue!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {venues.map(venue => (
            <div key={venue._id}
              style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>{venue.name}</h3>
                <span style={{ fontWeight: '700', color: '#4f46e5' }}>${venue.price}/day</span>
              </div>
              <p style={{ color: '#666', margin: '0 0 8px 0' }}>📍 {venue.location}</p>
              <p style={{ color: '#666', margin: '0 0 8px 0' }}>👥 Capacity: {venue.capacity}</p>
              {venue.amenities && <p style={{ color: '#999', margin: '0 0 12px 0', fontSize: '14px' }}>✨ {venue.amenities}</p>}
              {venue.description && <p style={{ color: '#999', margin: '0 0 12px 0', fontSize: '14px' }}>{venue.description}</p>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button onClick={() => handleEdit(venue)}
                  style={{ flex: 1, padding: '8px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(venue._id)}
                  style={{ flex: 1, padding: '8px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
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

export default Venues;