import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getMyAppointments } from '../../api';

export default function AppointmentHistory() {
  const showToast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (err) {
      // Fallback silently
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (slot) => {
    if (!slot) return 'N/A';
    const date = new Date(slot.date);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${slot.startTime}`;
  };

  const filtered = appointments.filter(a => {
    const matchSearch = (a.facultyId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.studentId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.purpose || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === '' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status) => {
    const icons = { approved: '✓', pending: '⏳', rejected: '✗', cancelled: '' };
    return (
      <span className={`badge badge-${status}`}>
        {icons[status] ? `${icons[status]} ` : ''}{status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div>
      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Search appointments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="empty-state"><p>Loading appointments...</p></div>
          ) : filtered.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Faculty</th>
                  <th>Date & Time</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(appt => (
                  <tr key={appt._id}>
                    <td><strong>{appt.facultyId?.name || appt.studentId?.name || 'N/A'}</strong></td>
                    <td>{formatDate(appt.slotId)}</td>
                    <td>{appt.purpose}</td>
                    <td>{statusBadge(appt.status)}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedAppt(appt)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="icon">📋</div>
              <p>No appointments found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedAppt(null)}>
          <div className="modal">
            <h2>Appointment Details</h2>
            <p className="sub">Complete information about this booking</p>
            <div className="detail-row"><span className="label">Faculty</span><span className="value">{selectedAppt.facultyId?.name || 'N/A'}</span></div>
            <div className="detail-row"><span className="label">Student</span><span className="value">{selectedAppt.studentId?.name || 'N/A'}</span></div>
            <div className="detail-row"><span className="label">Department</span><span className="value">{selectedAppt.facultyId?.department || 'N/A'}</span></div>
            <div className="detail-row"><span className="label">Date & Time</span><span className="value">{formatDate(selectedAppt.slotId)}</span></div>
            <div className="detail-row"><span className="label">Purpose</span><span className="value">{selectedAppt.purpose}</span></div>
            <div className="detail-row"><span className="label">Status</span><span className="value">{statusBadge(selectedAppt.status)}</span></div>
            <div className="detail-row"><span className="label">Booked On</span><span className="value">{new Date(selectedAppt.createdAt).toLocaleDateString()}</span></div>
            <div className="modal-actions">
              <button className="btn btn-primary btn-sm" onClick={() => setSelectedAppt(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
