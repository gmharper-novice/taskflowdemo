import { useEffect } from 'react';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
};

const cardStyle = {
  background: 'var(--color-surface)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-6)',
  width: '100%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: 'var(--shadow-lg)',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 'var(--space-4)',
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: 'var(--font-size-xl)',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  padding: 'var(--space-1)',
  lineHeight: 1,
};

export default function Modal({ isOpen, onClose, title, children, maxWidth }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={{ ...cardStyle, ...(maxWidth ? { maxWidth } : {}) }} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3>{title}</h3>
          <button style={closeBtnStyle} onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
