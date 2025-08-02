import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Chat', path: '/chat' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column bg-dark text-light">
      {/* Header */}
      <header className="bg-secondary shadow-sm">
        <div className="container-fluid py-3 d-flex justify-content-between align-items-center">
          <span className="fs-4 fw-bold text-light">Gemini Chat</span>

          <nav className="d-flex gap-3">
            {navItems.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className={`nav-link px-2 py-1 fw-medium ${
                  location.pathname === path
                    ? 'text-info border-bottom border-info'
                    : 'text-light'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="d-flex align-items-center gap-3">
            <span className="text-light small">{user?.name}</span>
            <button
              onClick={logout}
              className="btn btn-sm btn-outline-light"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1">
        <div className="container py-4">
          {children || <Outlet />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-top border-light py-3">
        <div className="container text-center text-light small">
          © {new Date().getFullYear()} Gemini Chat. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
