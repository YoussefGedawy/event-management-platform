import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [eventId, setEventId] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTasks();
    fetchEvents();
    fetchStaff();
  }, []);

  const fetchTasks = async (evId = '', status = '') => {
    try {
      const params = {};
      if (evId) params.eventId = evId;
      if (status) params.status = status;
      const response = await axios.get('http://localhost:5000/api/tasks', { headers, params });
      setTasks(response.data);
    } catch (error) {
      console.log('Error fetching tasks:', error);
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
    try {
      await axios.post('http://localhost:5000/api/tasks',
        { title, event: eventId, assignedStaff: assignedStaff || null }, { headers });
      fetchTasks(filterEvent, filterStatus);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { status }, { headers });
    fetchTasks(filterEvent, filterStatus);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, { headers });
    fetchTasks(filterEvent, filterStatus);
  };

  const resetForm = () => {
    setShowForm(false);
    setTitle(''); setEventId(''); setAssignedStaff('');
    setError('');
  };

  const statusColors = {
    not_assigned: '#f59e0b',
    in_progress: '#3b82f6',
    done: '#10b981'
  };

  const statusLabels = {
    not_assigned: 'Not Assigned',
    in_progress: 'In Progress',
    done: 'Done'
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
          <h1 style={{ margin: 0 }}>✅ Tasks</h1>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <option value="">All Events</option>
          {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: '180px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <option value="">All Statuses</option>
          <option value="not_assigned">Not Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={() => fetchTasks(filterEvent, filterStatus)}
          style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Filter
        </button>
        <button onClick={() => { setFilterEvent(''); setFilterStatus(''); fetchTasks(); }}
          style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Clear
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '20px' }}>Create New Task</h2>
          {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Task Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required
                  placeholder="e.g. Set up stage"
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
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Assign to Staff</label>
                <select value={assignedStaff} onChange={(e) => setAssignedStaff(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}>
                  <option value="">Unassigned</option>
                  {staff.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit"
                style={{ padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Create Task
              </button>
              <button type="button" onClick={resetForm}
                style={{ padding: '10px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <p style={{ fontSize: '48px' }}>✅</p>
          <p>No tasks yet. Create your first task!</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Task</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Event</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Assigned To</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task._id} style={{ borderBottom: index < tasks.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{task.title}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{task.event?.title || 'N/A'}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{task.assignedStaff?.name || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select value={task.status}
                      onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd',
                        backgroundColor: statusColors[task.status] + '20',
                        color: statusColors[task.status], fontWeight: '600', fontSize: '13px' }}>
                      <option value="not_assigned">Not Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleDelete(task._id)}
                      style={{ padding: '4px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      Delete
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

export default Tasks;