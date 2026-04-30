import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((icon, msg) => {
    setToast({ icon, msg });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 999,
          background: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 12,
          padding: '14px 20px', fontSize: '0.875rem', fontWeight: 500,
          boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 10,
          animation: 'fadeUp 0.3s ease both'
        }}>
          <span>{toast.icon}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}
