import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getNotifications } from '../../api';

export default function Notifications() {
  const showToast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      // fallback to empty
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (msg) => {
    if (!msg) return '🔔';
    const m = msg.toLowerCase();
    if (m.includes('approved')) return '✅';
    if (m.includes('rejected')) return '✗';
    if (m.includes('new appointment') || m.includes('request')) return '📅';
    if (m.includes('completed')) return '📋';
    return '🔔';
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return <div className="empty-state"><p>Loading notifications...</p></div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">🔔</div>
        <p>No notifications yet. You'll be notified when there's activity on your appointments.</p>
      </div>
    );
  }

  return (
    <div>
      {notifications.map((n, i) => (
        <div key={n._id || i} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
          <div className="notif-icon">{getIcon(n.message)}</div>
          <div>
            <h4>Notification</h4>
            <p>{n.message}</p>
            <div className="time">{timeAgo(n.createdAt)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
