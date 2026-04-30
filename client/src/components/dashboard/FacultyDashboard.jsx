import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getMyAppointments, updateAppointmentStatus } from '../../api';

export default function FacultyDashboard() {
  const showToast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAppointments(); }, []);

  const loadAppointments = async () => {
    try { const data = await getMyAppointments(); setAppointments(data); }
    catch (err) { /* fallback */ }
    finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      showToast('✅', `Appointment ${status}`);
      loadAppointments();
    } catch (err) { showToast('❌', err.message); }
  };

  const pending = appointments.filter(a => a.status === 'pending');
  const approved = appointments.filter(a => a.status === 'approved');

  const formatDate = (slot) => {
    if (!slot) return 'N/A';
    const d = new Date(slot.date);
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${slot.startTime}`;
  };

  return (
    <div>
      <div className="stats-row">
        <div className="stat-card"><div className="s-label">Total Requests</div><div className="s-num green">{appointments.length}</div><div className="s-sub">All time</div></div>
        <div className="stat-card"><div className="s-label">Pending</div><div className="s-num amber">{pending.length}</div><div className="s-sub">Need review</div></div>
        <div className="stat-card"><div className="s-label">Approved</div><div className="s-num green">{approved.length}</div><div className="s-sub">Confirmed</div></div>
        <div className="stat-card"><div className="s-label">Completion Rate</div><div className="s-num cyan">{appointments.length > 0 ? Math.round((approved.length / appointments.length) * 100) : 0}%</div><div className="s-sub">Approved ratio</div></div>
      </div>
      <div className="card mb-24">
        <div className="card-title">Pending Requests {pending.length > 0 && <span className="badge badge-pending">{pending.length} new</span>}</div>
        <div className="table-wrap">
          {pending.length > 0 ? (
            <table>
              <thead><tr><th>Student</th><th>Date & Time</th><th>Purpose</th><th>Actions</th></tr></thead>
              <tbody>
                {pending.map(appt => (
                  <tr key={appt._id}>
                    <td><strong>{appt.studentId?.name || 'N/A'}</strong><br/><span className="text-muted">{appt.studentId?.department || ''}</span></td>
                    <td>{formatDate(appt.slotId)}</td>
                    <td>{appt.purpose}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" style={{marginRight:6}} onClick={() => handleAction(appt._id, 'approved')}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleAction(appt._id, 'rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state"><div className="icon">✅</div><p>No pending requests. All caught up!</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
