import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function VendorDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vendors/requests', { headers });
      setRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    await axios.put(`http://localhost:5000/api/vendors/requests/${id}`, { status }, { headers });
    fetchRequests();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const statusColors = {
    pending: '#f59e0b',
    accepted: '#3b82f6',
    declined: '#ef4444',
    delivered: '#10b981'
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {user?.name} 👋</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#4f46e5', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>Total Requests</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{requests.length}</p>
        </div>
        <div style={{ background: '#f59e0b', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>Pending</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{requests.filter(r => r.status === 'pending').length}</p>
        </div>
        <div style={{ background: '#10b981', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>Delivered</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{requests.filter(r => r.status === 'delivered').length}</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px' }}>Sourcing Requests</h2>
      {requests.length === 0 ? (
        <p style={{ color: '#666' }}>No requests yet.</p>
      ) : (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Event</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Items</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Delivery Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req._id} style={{ borderBottom: index < requests.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{req.event?.title || 'N/A'}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{req.requestedItems}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>
                    {req.deliveryDate ? new Date(req.deliveryDate).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select value={req.status}
                      onChange={(e) => handleStatusUpdate(req._id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd',
                        backgroundColor: statusColors[req.status] + '20',
                        color: statusColors[req.status], fontWeight: '600' }}>
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
    </div>
  );
}

export default VendorDashboard;