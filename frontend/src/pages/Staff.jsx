import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [filterSpeciality, setFilterSpeciality] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/staff', { headers });
      setStaff(response.data);
    } catch (error) {
      console.log('Error fetching staff:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role: 'staff'
      }, { headers });
      setSuccess('Staff member created successfully!');
      fetchStaff();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this staff member?')) return;
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, { isActive: false }, { headers });
      fetchStaff();
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setName(''); setEmail(''); setPassword('');
    setError('');
  };

  const filteredStaff = filterSpeciality
    ? staff.filter(s => s.name.toLowerCase().includes(filterSpeciality.toLowerCase()))
    : staff;

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <button onClick={() => navigate('/dashboard/organizer')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', marginBottom: '8px' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ margin: 0 }}>👷 Staff</h1>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          + Add Staff Member
        </button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input value={filterSpeciality} onChange={(e) => setFilterSpeciality(e.target.value)}
          placeholder="Search by name..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
        <button onClick={() => setFilterSpeciality('')}
          style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Clear
        </button>
      </div>

      {/* Add Staff Form */}
      {showForm && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '20px' }}>Add New Staff Member</h2>
          {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginBottom: '12px' }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Full Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="Staff name"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="staff@email.com"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Password *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Set password"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit"
                style={{ padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Create Staff Account
              </button>
              <button type="button" onClick={resetForm}
                style={{ padding: '10px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff List */}
      {filteredStaff.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <p style={{ fontSize: '48px' }}>👷</p>
          <p>No staff members yet. Add your first staff member!</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member, index) => (
                <tr key={member._id} style={{ borderBottom: index < filteredStaff.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      {member.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{member.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      backgroundColor: member.isActive ? '#d1fae5' : '#fee2e2',
                      color: member.isActive ? '#059669' : '#dc2626' }}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleDeactivate(member._id)}
                      style={{ padding: '6px 14px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      Deactivate
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

export default Staff;