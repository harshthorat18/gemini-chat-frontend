import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Allow fade-out
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-success text-white' : 'bg-danger text-white';
  const icon = type === 'success' ? '✔️' : '❌';

  return (
    <div
      className={`toast show position-fixed bottom-0 end-0 m-4 p-3 rounded shadow-sm ${bgColor} transition-opacity ${visible ? 'opacity-100' : 'opacity-0'}`}
      role="alert"
      style={{ zIndex: 1050 }}
    >
      <div className="d-flex align-items-center">
        <strong className="me-2">{icon}</strong>
        <div className="flex-grow-1">{message}</div>
      </div>
    </div>
  );
};

export default Toast;
