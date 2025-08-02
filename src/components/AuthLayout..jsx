import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-light p-3">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4 fw-bold text-light">Gemini Chat</h2>

        <div className="card bg-secondary text-light shadow-sm">
          <div className="card-body p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
