import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getMyAppointments } from '../../api';

export default function StudentOverview({ onNavigate }) {
  const { user } = useAuth();
  const showToast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getMyAppointments();
      setAppointments(data);
      setStats({
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        approved: data.filter(a => a.status === 'approved').length,
        completed: data.filter(a => a.status === 'completed').length,
      });
    } catch (err) {
      // Use fallback data if no appointments yet
      setStats({ total: 0, pending: 0, approved: 0, completed: 0 });
    } finally {
      setLoading(false);
    }
  };

  const upcoming = appointments.filter(a => a.status === 'approved' || a.status === 'pending').slice(0, 5);

  const formatDate = (slot) => {
    if (!slot) return 'N/A';
    const date = new Date(slot.date);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${slot.startTime}`;
  };

  return (
    <div>
      <div className="stats-row">
        <div className="stat-card">
          <div className="s-label">Total Bookings</div>
          <div className="s-num green">{stats.total}</div>
          <div className="s-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="s-label">Pending</div>
          <div className="s-num amber">{stats.pending}</div>
          <div className="s-sub">Awaiting approval</div>
        </div>
        <div className="stat-card">
          <div className="s-label">Approved</div>
          <div className="s-num green">{stats.approved}</div>
          <div className="s-sub">Confirmed</div>
        </div>
        <div className="stat-card">
          <div className="s-label">Completed</div>
          <div className="s-num cyan">{stats.completed}</div>
          <div className="s-sub">Past meetings</div>
        </div>
      </div>

      <div className="card mb-24">
        <div className="card-title">
          Upcoming Appointments
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('book')}>+ Book New</button>
        </div>
        <div className="table-wrap">
          {upcoming.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Faculty</th>
                  <th>Department</th>
                  <th>Date & Time</th>
                  <th>Purpose</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map(appt => (
                  <tr key={appt._id}>
                    <td><strong>{appt.facultyId?.name || 'N/A'}</strong></td>
                    <td>{appt.facultyId?.department || 'N/A'}</td>
                    <td>{formatDate(appt.slotId)}</td>
                    <td>{appt.purpose}</td>
                    <td>
                      <span className={`badge badge-${appt.status}`}>
                        {appt.status === 'approved' ? '✓ ' : appt.status === 'pending' ? '⏳ ' : ''}
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="icon">📅</div>
              <p>No upcoming appointments. Book one now!</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Quick Actions</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => onNavigate('book')}>📅 Book Appointment</button>
          <button className="btn btn-outline" onClick={() => onNavigate('history')}>📋 View History</button>
          <button className="btn btn-outline" onClick={() => onNavigate('faculty')}>👩‍🏫 Browse Faculty</button>
        </div>
      </div>
    </div>
  );
}
