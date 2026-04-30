import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from './Sidebar';
import StudentOverview from './dashboard/StudentOverview';
import BrowseFaculty from './dashboard/BrowseFaculty';
import BookAppointment from './dashboard/BookAppointment';
import AppointmentHistory from './dashboard/AppointmentHistory';
import FacultyDashboard from './dashboard/FacultyDashboard';
import ManageSlots from './dashboard/ManageSlots';
import AdminDashboard from './dashboard/AdminDashboard';
import ManageUsers from './dashboard/ManageUsers';
import Notifications from './dashboard/Notifications';
import Profile from './dashboard/Profile';
import './Dashboard.css';

const navConfig = {
  student: [
    { icon: '🏠', label: 'Overview', section: 'overview' },
    { icon: '👩‍🏫', label: 'Browse Faculty', section: 'faculty' },
    { icon: '📅', label: 'Book Appointment', section: 'book' },
    { icon: '📋', label: 'My Appointments', section: 'history' },
    { icon: '🔔', label: 'Notifications', section: 'notifications' },
    { icon: '👤', label: 'Profile', section: 'profile' },
  ],
  faculty: [
    { icon: '🏠', label: 'Dashboard', section: 'faculty-dash' },
    { icon: '⏰', label: 'Manage Slots', section: 'slots' },
    { icon: '📋', label: 'Appointments', section: 'history' },
    { icon: '🔔', label: 'Notifications', section: 'notifications' },
    { icon: '👤', label: 'Profile', section: 'profile' },
  ],
  admin: [
    { icon: '🏠', label: 'Dashboard', section: 'admin-dash' },
    { icon: '👥', label: 'Manage Users', section: 'users' },
    { icon: '📋', label: 'All Appointments', section: 'history' },
    { icon: '🔔', label: 'Notifications', section: 'notifications' },
    { icon: '👤', label: 'Profile', section: 'profile' },
  ]
};

const defaultSection = { student: 'overview', faculty: 'faculty-dash', admin: 'admin-dash' };
const roleLabels = { student: 'Student Portal', faculty: 'Faculty Portal', admin: 'Admin Panel' };

const sectionTitles = {
  'overview': 'Dashboard',
  'faculty': 'Browse Faculty',
  'book': 'Book Appointment',
  'history': 'Appointment History',
  'notifications': 'Notifications',
  'profile': 'My Profile',
  'faculty-dash': 'Faculty Dashboard',
  'slots': 'Manage Slots',
  'admin-dash': 'Admin Dashboard',
  'users': 'Manage Users'
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const showToast = useToast();
  const role = user?.role || 'student';
  const [activeSection, setActiveSection] = useState(defaultSection[role]);
  const [notifCount, setNotifCount] = useState(3);

  const showSection = useCallback((section) => {
    setActiveSection(section);
    if (section === 'notifications') {
      setNotifCount(0);
    }
  }, []);

  const handleLogout = () => {
    logout();
    showToast('👋', 'Signed out successfully');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <StudentOverview onNavigate={showSection} />;
      case 'faculty':
        return <BrowseFaculty onNavigate={showSection} />;
      case 'book':
        return <BookAppointment />;
      case 'history':
        return <AppointmentHistory />;
      case 'faculty-dash':
        return <FacultyDashboard />;
      case 'slots':
        return <ManageSlots />;
      case 'admin-dash':
        return <AdminDashboard />;
      case 'users':
        return <ManageUsers />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      default:
        return <StudentOverview onNavigate={showSection} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        user={user}
        role={role}
        roleLabel={roleLabels[role]}
        navItems={navConfig[role]}
        activeSection={activeSection}
        onNavigate={showSection}
        onLogout={handleLogout}
      />
      <div className="main-content">
        <div className="topbar">
          <h1>{sectionTitles[activeSection] || 'Dashboard'}</h1>
          <div className="topbar-actions">
            <div className="notif-btn" onClick={() => showSection('notifications')}>
              🔔
              {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
            </div>
            <div className="avatar top-avatar" onClick={() => showSection('profile')} style={{ cursor: 'pointer' }}>
              {user?.name?.[0] || 'U'}
            </div>
          </div>
        </div>
        <div className="content-area">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
