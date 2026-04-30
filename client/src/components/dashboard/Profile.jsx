import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const name = user?.name || 'User';
  const email = user?.email || 'N/A';
  const dept = user?.department || 'General';
  const role = user?.role || 'student';
  const phone = user?.phone || 'N/A';
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div>
      <div className="profile-header">
        <div className="profile-avatar">{name[0]}</div>
        <div>
          <h2>{name}</h2>
          <p>{dept} · {roleLabel}</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 4 }}>{email}</p>
        </div>
        <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>Edit Profile</button>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Personal Information</div>
          <div className="detail-row"><span className="label">Full Name</span><span className="value">{name}</span></div>
          <div className="detail-row"><span className="label">Email</span><span className="value">{email}</span></div>
          <div className="detail-row"><span className="label">Department</span><span className="value">{dept}</span></div>
          <div className="detail-row"><span className="label">Role</span><span className="value">{roleLabel}</span></div>
          <div className="detail-row"><span className="label">Phone</span><span className="value">{phone}</span></div>
        </div>
        <div className="card">
          <div className="card-title">Account Details</div>
          <div className="detail-row"><span className="label">Member Since</span><span className="value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span></div>
          <div className="detail-row"><span className="label">Account Type</span><span className="value">{roleLabel}</span></div>
          <div className="detail-row"><span className="label">Status</span><span className="value"><span className="badge badge-approved">Active</span></span></div>
        </div>
      </div>
    </div>
  );
}
