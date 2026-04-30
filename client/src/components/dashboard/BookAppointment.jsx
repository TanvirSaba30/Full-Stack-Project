import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getFacultyList, getAvailableSlots, bookAppointment } from '../../api';

const purposes = ['Project Discussion', 'Attendance Issue', 'Career Guidance', 'Personal Mentoring', 'Academic Guidance', 'Exam Related'];

export default function BookAppointment() {
  const showToast = useToast();
  const [faculty, setFaculty] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [purpose, setPurpose] = useState(purposes[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadFaculty();
  }, []);

  useEffect(() => {
    if (selectedFacultyId) {
      loadSlots(selectedFacultyId);
    }
  }, [selectedFacultyId]);

  const loadFaculty = async () => {
    try {
      const data = await getFacultyList();
      setFaculty(data);
      if (data.length > 0) setSelectedFacultyId(data[0]._id);
    } catch (err) {
      showToast('❌', 'Failed to load faculty');
    }
  };

  const loadSlots = async (facultyId) => {
    setSlotsLoading(true);
    try {
      const data = await getAvailableSlots(facultyId);
      setSlots(data);
    } catch (err) {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    return `${hr % 12 || 12}:${m} ${ampm}`;
  };

  const handleBook = async () => {
    if (!selectedSlot) {
      showToast('⚠️', 'Please select a time slot');
      return;
    }
    setLoading(true);
    try {
      await bookAppointment(selectedSlot._id, purpose);
      const fac = faculty.find(f => f._id === selectedFacultyId);
      setSuccess({
        faculty: fac?.name || 'Faculty',
        slot: `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}`,
        purpose
      });
      showToast('✅', 'Appointment booked successfully!');
      // Reload slots
      loadSlots(selectedFacultyId);
      setSelectedSlot(null);
    } catch (err) {
      showToast('❌', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-title">Book an Appointment</div>

        <div className="form-group">
          <label>Select Faculty</label>
          <select value={selectedFacultyId} onChange={e => setSelectedFacultyId(e.target.value)}>
            {faculty.map(f => (
              <option key={f._id} value={f._id}>{f.name} — {f.department || 'General'}</option>
            ))}
          </select>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 14 }}>Available time slots</p>

        {slotsLoading ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 24 }}>Loading slots...</p>
        ) : slots.length > 0 ? (
          <div className="slots-grid mb-24">
            {slots.map(slot => (
              <div
                key={slot._id}
                className={`slot-card ${selectedSlot?._id === slot._id ? 'selected' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                <div className="slot-time">{formatTime(slot.startTime)}</div>
                <div className="slot-date">
                  {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '30px 20px' }}>
            <div className="icon">📅</div>
            <p>No available slots for this faculty. Try another faculty member.</p>
          </div>
        )}

        <div className="form-group">
          <label>Purpose of Meeting</label>
          <select value={purpose} onChange={e => setPurpose(e.target.value)}>
            {purposes.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Additional Notes (optional)</label>
          <textarea rows="3" placeholder="Any specific details for the faculty..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: 13 }}
          onClick={handleBook}
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Confirm Booking →'}
        </button>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSuccess(null)}>
          <div className="modal" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
            <h2>Booking Submitted!</h2>
            <p className="sub" style={{ textAlign: 'center' }}>
              Your appointment request has been sent to the faculty. You'll receive a notification once it's reviewed.
            </p>
            <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: 20, margin: '20px 0', textAlign: 'left' }}>
              <div className="detail-row"><span className="label">Faculty</span><span className="value">{success.faculty}</span></div>
              <div className="detail-row"><span className="label">Time Slot</span><span className="value">{success.slot}</span></div>
              <div className="detail-row"><span className="label">Purpose</span><span className="value">{success.purpose}</span></div>
              <div className="detail-row"><span className="label">Status</span><span className="value"><span className="badge badge-pending">⏳ Pending</span></span></div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setSuccess(null)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
