import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const features = [
  { icon: '🗓️', title: 'Smart Scheduling', desc: 'View real-time availability and book instantly without double-booking conflicts.' },
  { icon: '🔔', title: 'Instant Notifications', desc: 'Get alerted for booking confirmations, reminders, approvals, and cancellations.' },
  { icon: '✅', title: 'Approval Workflow', desc: 'Faculty can approve, reject, or reschedule — students are notified automatically.' },
  { icon: '📊', title: 'Analytics & Reports', desc: 'Track appointment frequency, faculty workload, and student interaction stats.' },
  { icon: '🔐', title: 'Role-Based Access', desc: 'Separate secure dashboards for students, faculty, and administrators.' },
  { icon: '📋', title: 'Appointment History', desc: 'Complete records of past meetings with purpose, status, and timestamps.' },
];

const stats = [
  { num: '1,200+', label: 'Students Registered' },
  { num: '180+', label: 'Faculty Members' },
  { num: '4,800+', label: 'Appointments Booked' },
  { num: '98%', label: 'Satisfaction Rate' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-bg" />

      {/* Nav */}
      <nav className="landing-nav">
        <div className="logo">Uni<span>meet</span></div>
        <div className="nav-links">
          <button className="btn btn-ghost" onClick={() => navigate('/auth?mode=login')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/auth?mode=register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">Faculty Appointment Management System</div>
        <h1>Schedule Smarter,<br />Meet <em>Better</em></h1>
        <p>Unimeet connects students and faculty through a seamless appointment platform — no more waiting, no more confusion.</p>
        <div className="hero-cta">
          <button className="btn btn-primary" onClick={() => navigate('/auth?mode=register')}>Book Appointment →</button>
          <button className="btn btn-ghost" onClick={() => navigate('/auth?mode=login')}>Faculty Login</button>
        </div>
      </section>

      {/* Stats */}
      <div className="landing-stats">
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <span className="stat-num">{s.num}</span>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="features">
        <div className="section-label">Why Unimeet</div>
        <div className="section-title">Everything you need<br />to manage meetings</div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
