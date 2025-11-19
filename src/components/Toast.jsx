import React, { useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import '../styles/Toast.css';

const Toast = () => {
  const { toasts } = useCalendar();

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  return (
    <div className={`toast ${toast.type} ${show ? 'show' : ''}`}>
      {toast.message}
    </div>
  );
};

export default Toast;
