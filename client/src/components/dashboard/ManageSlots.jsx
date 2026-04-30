import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getMySlots, createSlot } from '../../api';

export default function ManageSlots() {
  const showToast = useToast();
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '' });

  useEffect(() => { loadSlots(); }, []);

  const loadSlots = async () => {
    try { const data = await getMySlots(); setSlots(data); }
    catch (err) { /* fallback */ }
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  const handleAdd = async () => {
    if (!form.date || !form.startTime || !form.endTime) {
      showToast('⚠️', 'Please fill all slot fields'); return;
    }
    try {
      await createSlot({ date: form.date, startTime: form.startTime, endTime: form.endTime });
      showToast('✅', 'New slot added successfully!');
      setShowModal(false);
      setForm({ date: '', startTime: '', endTime: '' });
      loadSlots();
    } catch (err) { showToast('❌', err.message); }
  };

  return (
    <div>
      <div className="card mb-24">
        <div className="card-title">My Time Slots <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Slot</button></div>
        {slots.length > 0 ? (
          <div className="slot-manage-grid">
            {slots.map(slot => (
              <div key={slot._id} className="slot-manage-card">
                <div className="smc-time">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</div>
                <div className="smc-date">{new Date(slot.date).toDateString()}</div>
                <div style={{ marginBottom: 12 }}>
                  <span className={`badge ${slot.status === 'available' ? 'badge-approved' : 'badge-pending'}`}>
                    {slot.status === 'available' ? 'Available' : 'Booked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"><div className="icon">⏰</div><p>No slots created yet. Add your first time slot!</p></div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2>Add Time Slot</h2>
            <p className="sub">Create a new available appointment slot</p>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            <div className="grid-2">
              <div className="form-group"><label>Start Time</label><input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} /></div>
              <div className="form-group"><label>End Time</label><input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} /></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Add Slot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
