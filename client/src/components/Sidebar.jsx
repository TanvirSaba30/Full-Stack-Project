export default function Sidebar({ user, role, roleLabel, navItems, activeSection, onNavigate, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">Unimeet</div>
        <div className="sidebar-role">{roleLabel}</div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.section}
            className={`nav-item ${activeSection === item.section ? 'active' : ''}`}
            onClick={() => onNavigate(item.section)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user?.name?.[0] || 'U'}</div>
          <div>
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-dept">{user?.department || 'General'}</div>
          </div>
        </div>
        <button
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={onLogout}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
