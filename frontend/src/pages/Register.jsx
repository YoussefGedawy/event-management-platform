import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('organizer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role
      });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      {/* Left Side */}
      <div className="register-left">
        <div className="register-left-content">
          <div className="register-brand">
            <div className="register-brand-icon">🎯</div>
            <span className="register-brand-name">EventFlow</span>
          </div>
          <h1 className="register-left-title">
            Join the platform today
          </h1>
          <p className="register-left-subtitle">
            Create your account and start managing events, venues, guests and vendors all in one place.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="register-right">
        <div className="register-card">
          <div className="register-card-header">
            <h2>Create an account</h2>
            <p>Fill in your details to get started</p>
          </div>

          {error && <div className="error-banner">⚠️ {error}</div>}
          {success && <div className="success-banner">✅ {success}</div>}

          <form onSubmit={handleRegister} className="register-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="organizer">Organizer</option>
                <option value="staff">Staff</option>
                <option value="vendor">Vendor</option>
                <option value="guest">Guest</option>
                <option value="venue_owner">Venue Owner</option>
              </select>
            </div>

            <button type="submit" className="register-btn">
              Create Account
            </button>
          </form>

          <p className="login-link">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;