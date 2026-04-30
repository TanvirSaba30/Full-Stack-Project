export default function AdminDashboard() {
  return (
    <div>
      <div className="stats-row">
        <div className="stat-card"><div className="s-label">Total Students</div><div className="s-num green">1,248</div><div className="s-sub">Registered</div></div>
        <div className="stat-card"><div className="s-label">Faculty Members</div><div className="s-num cyan">184</div><div className="s-sub">Active</div></div>
        <div className="stat-card"><div className="s-label">Appointments</div><div className="s-num amber">4,832</div><div className="s-sub">All time</div></div>
        <div className="stat-card"><div className="s-label">Today's Meetings</div><div className="s-num green">28</div><div className="s-sub">Scheduled today</div></div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Department Overview</div>
          <table>
            <thead><tr><th>Department</th><th>Faculty</th><th>Appts</th></tr></thead>
            <tbody>
              <tr><td>Computer Science</td><td>42</td><td>1,204</td></tr>
              <tr><td>Mathematics</td><td>28</td><td>876</td></tr>
              <tr><td>Electronics</td><td>35</td><td>952</td></tr>
              <tr><td>Physics</td><td>24</td><td>680</td></tr>
              <tr><td>Management</td><td>30</td><td>740</td></tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-title">Recent Activity</div>
          <div className="notif-item unread">
            <div className="notif-icon">📅</div>
            <div><h4>New appointment booked</h4><p>Ravi Kumar → Dr. Sharma</p><div className="time">2 min ago</div></div>
          </div>
          <div className="notif-item">
            <div className="notif-icon">✅</div>
            <div><h4>Appointment approved</h4><p>Dr. Nair approved Priya Singh</p><div className="time">15 min ago</div></div>
          </div>
          <div className="notif-item">
            <div className="notif-icon">👤</div>
            <div><h4>New faculty registered</h4><p>Prof. Suresh joined Electronics dept.</p><div className="time">1 hr ago</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
