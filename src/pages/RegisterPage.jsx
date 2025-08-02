// RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout.';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);

    if (result.success) {
      setToast({ message: result.message, type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setToast({ message: result.message, type: 'error' });
    }

    setLoading(false);
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <AuthLayout>
      <div className="text-center mb-4">
        <h2 className="fw-bold text-light">Create a New Account</h2>
        <p className="text-muted">
          Already have one?{' '}
          <Link to="/login" className="text-info text-decoration-none">
            Sign in here
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="text-white">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="form-control bg-dark text-white border-secondary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="form-control bg-dark text-white border-secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="form-control bg-dark text-white border-secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="form-control bg-dark text-white border-secondary"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
          />
        </div>

        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Sign up'}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </AuthLayout>
  );
};

export default RegisterPage;
