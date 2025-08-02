import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/user/me', { name, email, avatar });
      updateUser(response.data);
      setToast({ message: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => setToast(null);

  return (
    <div className="container my-5 text-white">
      <div className="card bg-dark border-secondary shadow">
        <div className="card-header border-secondary">
          <h2 className="mb-0">Your Profile</h2>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Avatar Section */}
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '130px', height: '130px', overflow: 'hidden' }}>
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-100 h-100 object-fit-cover"
                  />
                ) : (
                  <span className="fs-1 text-light">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <h5>{user?.name}</h5>
              <p className="text-muted small">{user?.email}</p>
            </div>

            {/* Form Section */}
            <div className="col-md-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control bg-dark text-white border-secondary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control bg-dark text-white border-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="avatar" className="form-label">Avatar URL</label>
                  <input
                    type="text"
                    id="avatar"
                    className="form-control bg-dark text-white border-secondary"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
};

export default ProfilePage;
