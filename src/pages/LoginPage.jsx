import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout.';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/chat');
    } else {
      setToast({ message: result.message, type: 'error' });
    }

    setLoading(false);
  };

  const closeToast = () => setToast(null);

  return (
    <AuthLayout>
      <h2 className="text-center mb-3 text-white">Sign in to your account</h2>
      <p className="text-center text-light mb-4">
        Or{' '}
        <Link to="/register" className="text-info fw-bold">
          create a new account
        </Link>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label text-white">Email address</label>
          <input
            id="email"
            type="email"
            className="form-control bg-dark text-white border-secondary"
            placeholder="Enter email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label text-white">Password</label>
          <input
            id="password"
            type="password"
            className="form-control bg-dark text-white border-secondary"
            placeholder="Enter password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-grid">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-info text-white"
          >
            {loading ? <LoadingSpinner /> : 'Sign in'}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </AuthLayout>
  );
};

export default LoginPage;
