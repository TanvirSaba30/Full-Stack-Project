import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getFacultyList } from '../../api';

export default function BrowseFaculty({ onNavigate }) {
  const showToast = useToast();
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      const data = await getFacultyList();
      setFaculty(data);
    } catch (err) {
      showToast('❌', 'Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  const departments = [...new Set(faculty.map(f => f.department).filter(Boolean))];
  const icons = ['👨‍🏫', '👩‍🏫', '👨‍💼', '👩‍🔬', '👨‍💻', '👩‍💼'];

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) &&
    (deptFilter === '' || f.department === deptFilter)
  );

  return (
    <div>
      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Search faculty by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="filter-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading faculty...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="faculty-grid">
          {filtered.map((f, i) => (
            <div
              key={f._id}
              className="faculty-card"
              onClick={() => setSelectedFaculty(f)}
            >
              <div className="fc-avatar">{icons[i % icons.length]}</div>
              <h3>{f.name}</h3>
              <div className="dept">{f.department || 'General'}</div>
              <div className="desig">{f.designation || 'Faculty'}</div>
              {f.subject && <div className="subject">📚 {f.subject}</div>}
              <div className="slots-available">📅 Max {f.maxAppointments || 10} appointments</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon">👩‍🏫</div>
          <p>No faculty found matching your search.</p>
        </div>
      )}

      {/* Faculty Detail Modal */}
      {selectedFaculty && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedFaculty(null)}>
          <div className="modal">
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16,
                background: 'linear-gradient(135deg,rgba(74,222,128,0.3),rgba(34,211,238,0.3))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem'
              }}>👩‍🏫</div>
              <div>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: '1.3rem', fontWeight: 900 }}>{selectedFaculty.name}</h2>
                <p style={{ color: 'var(--accent2)', fontSize: '0.85rem' }}>{selectedFaculty.department || 'General'}</p>
              </div>
            </div>
            <div className="detail-row"><span className="label">Designation</span><span className="value">{selectedFaculty.designation || 'Faculty'}</span></div>
            <div className="detail-row"><span className="label">Subject</span><span className="value">{selectedFaculty.subject || 'N/A'}</span></div>
            <div className="detail-row"><span className="label">Email</span><span className="value">{selectedFaculty.email}</span></div>
            <div className="detail-row"><span className="label">Max Appointments</span><span className="value">{selectedFaculty.maxAppointments || 10}</span></div>
            <div className="detail-row"><span className="label">Available Slots</span><span className="value green">Open for booking</span></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setSelectedFaculty(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setSelectedFaculty(null); onNavigate('book'); }}>Book Appointment →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
