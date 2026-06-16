import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTasks();
    fetchEvents();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', { headers });
      setTasks(response.data.filter(t => t.assignedStaff?._id === user?.id));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events', { headers });
      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { status }, { headers });
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const statusColors = {
    not_assigned: '#f59e0b',
    in_progress: '#3b82f6',
    done: '#10b981'
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {user?.name} 👋</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#4f46e5', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>My Tasks</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{tasks.length}</p>
        </div>
        <div style={{ background: '#10b981', color: 'white', padding: '20px', borderRadius: '12px' }}>
          <h3>Completed</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{tasks.filter(t => t.status === 'done').length}</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px' }}>My Tasks</h2>
      {tasks.length === 0 ? (
        <p style={{ color: '#666' }}>No tasks assigned to you yet.</p>
      ) : (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Task</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Event</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task._id} style={{ borderBottom: index < tasks.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{task.title}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{task.event?.title || 'N/A'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select value={task.status}
                      onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd',
                        backgroundColor: statusColors[task.status] + '20',
                        color: statusColors[task.status], fontWeight: '600' }}>
                      <option value="not_assigned">Not Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
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

export default StaffDashboard;