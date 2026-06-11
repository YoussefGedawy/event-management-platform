import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('vendors');
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [search, setSearch] = useState('');

  // Vendor form state
  const [companyName, setCompanyName] = useState('');
  const [supplies, setSupplies] = useState('');
  const [location, setLocation] = useState('');
  const [pricingList, setPricingList] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  // Request form state
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [requestedItems, setRequestedItems] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchVendors();
    fetchRequests();
    fetchEvents();
  }, []);

  const fetchVendors = async (searchTerm = '') => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      const response = await axios.get('http://localhost:5000/api/vendors', { headers, params });
      setVendors(response.data);
    } catch (error) {
      console.log('Error fetching vendors:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vendors/requests', { headers });
      setRequests(response.data);
    } catch (error) {
      console.log('Error fetching requests:', error);
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

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/vendors',
        { companyName, supplies, location, pricingList, contactInfo }, { headers });
      fetchVendors();
      resetVendorForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/vendors/requests',
        { vendor: selectedVendor, event: selectedEvent, requestedItems, quantity, deliveryDate, notes }, { headers });
      fetchRequests();
      resetRequestForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleRequestStatusUpdate = async (id, status) => {
    await axios.put(`http://localhost:5000/api/vendors/requests/${id}`, { status }, { headers });
    fetchRequests();
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm('Delete this vendor?')) return;
    await axios.delete(`http://localhost:5000/api/vendors/${id}`, { headers });
    fetchVendors();
  };

  const resetVendorForm = () => {
    setShowForm(false);
    setCompanyName(''); setSupplies(''); setLocation('');
    setPricingList(''); setContactInfo(''); setError('');
  };

  const resetRequestForm = () => {
    setShowRequestForm(false);
    setSelectedVendor(''); setSelectedEvent(''); setRequestedItems('');
    setQuantity(''); setDeliveryDate(''); setNotes(''); setError('');
  };

  const statusColors = {
    pending: '#f59e0b',
    accepted: '#3b82f6',
    declined: '#ef4444',
    delivered: '#10b981'
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
          <h1 style={{ margin: 0 }}>🚚 Vendors</h1>
        </div>
        <button onClick={() => activeTab === 'vendors' ? setShowForm(true) : setShowRequestForm(true)}
          style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          {activeTab === 'vendors' ? '+ Add Vendor' : '+ New Request'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
        <button onClick={() => setActiveTab('vendors')}
          style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
            backgroundColor: activeTab === 'vendors' ? 'white' : 'transparent',
            color: activeTab === 'vendors' ? '#4f46e5' : '#666',
            boxShadow: activeTab === 'vendors' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
          Vendors
        </button>
        <button onClick={() => setActiveTab('requests')}
          style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
            backgroundColor: activeTab === 'requests' ? 'white' : 'transparent',
            color: activeTab === 'requests' ? '#4f46e5' : '#666',
            boxShadow: activeTab === 'requests' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
          Requests
        </button>
      </div>

      {/* VENDORS TAB */}
      {activeTab === 'vendors' && (
        <>
          {/* Search */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <button onClick={() => fetchVendors(search)}
              style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Search
            </button>
            <button onClick={() => { setSearch(''); fetchVendors(); }}
              style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Clear
            </button>
          </div>

          {/* Add Vendor Form */}
          {showForm && (
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ marginBottom: '20px' }}>Add New Vendor</h2>
              {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
              <form onSubmit={handleVendorSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Company Name *</label>
                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required
                      placeholder="Company name"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Supplies Offered *</label>
                    <input value={supplies} onChange={(e) => setSupplies(e.target.value)} required
                      placeholder="e.g. Catering, Flowers, AV Equipment"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Location *</label>
                    <input value={location} onChange={(e) => setLocation(e.target.value)} required
                      placeholder="City, Country"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Contact Info</label>
                    <input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="Email or phone"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Pricing List</label>
                    <input value={pricingList} onChange={(e) => setPricingList(e.target.value)}
                      placeholder="e.g. $50/person for catering"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button type="submit"
                    style={{ padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    Add Vendor
                  </button>
                  <button type="button" onClick={resetVendorForm}
                    style={{ padding: '10px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vendors List */}
          {vendors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
              <p style={{ fontSize: '48px' }}>🚚</p>
              <p>No vendors yet. Add your first vendor!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {vendors.map(vendor => (
                <div key={vendor._id}
                  style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{vendor.companyName}</h3>
                  <p style={{ color: '#666', margin: '0 0 6px 0' }}>📦 {vendor.supplies}</p>
                  <p style={{ color: '#666', margin: '0 0 6px 0' }}>📍 {vendor.location}</p>
                  {vendor.pricingList && <p style={{ color: '#999', margin: '0 0 6px 0', fontSize: '14px' }}>💰 {vendor.pricingList}</p>}
                  {vendor.contactInfo && <p style={{ color: '#999', margin: '0 0 12px 0', fontSize: '14px' }}>📞 {vendor.contactInfo}</p>}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => { setSelectedVendor(vendor._id); setActiveTab('requests'); setShowRequestForm(true); }}
                      style={{ flex: 1, padding: '8px', backgroundColor: '#ede9fe', color: '#4f46e5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                      Request
                    </button>
                    <button onClick={() => handleDeleteVendor(vendor._id)}
                      style={{ flex: 1, padding: '8px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
        <>
          {/* New Request Form */}
          {showRequestForm && (
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ marginBottom: '20px' }}>New Sourcing Request</h2>
              {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
              <form onSubmit={handleRequestSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Vendor *</label>
                    <select value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)} required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}>
                      <option value="">Select vendor</option>
                      {vendors.map(v => <option key={v._id} value={v._id}>{v.companyName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Event *</label>
                    <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}>
                      <option value="">Select event</option>
                      {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Requested Items *</label>
                    <input value={requestedItems} onChange={(e) => setRequestedItems(e.target.value)} required
                      placeholder="e.g. 50 chairs, flowers"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Quantity</label>
                    <input value={quantity} onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 50 units"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Delivery Date</label>
                    <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Notes</label>
                    <input value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button type="submit"
                    style={{ padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    Submit Request
                  </button>
                  <button type="button" onClick={resetRequestForm}
                    style={{ padding: '10px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Requests List */}
          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
              <p style={{ fontSize: '48px' }}>📋</p>
              <p>No requests yet. Create your first sourcing request!</p>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Vendor</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Event</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Items</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Delivery</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, index) => (
                    <tr key={req._id} style={{ borderBottom: index < requests.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '500' }}>{req.vendor?.companyName || 'N/A'}</td>
                      <td style={{ padding: '12px 16px', color: '#666' }}>{req.event?.title || 'N/A'}</td>
                      <td style={{ padding: '12px 16px', color: '#666' }}>{req.requestedItems}</td>
                      <td style={{ padding: '12px 16px', color: '#666' }}>
                        {req.deliveryDate ? new Date(req.deliveryDate).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <select value={req.status}
                          onChange={(e) => handleRequestStatusUpdate(req._id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd',
                            backgroundColor: statusColors[req.status] + '20',
                            color: statusColors[req.status], fontWeight: '600', fontSize: '13px' }}>
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="declined">Declined</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Vendors;