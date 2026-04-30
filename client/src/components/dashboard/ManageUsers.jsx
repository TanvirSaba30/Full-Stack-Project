export default function ManageUsers() {
  const users = [
    { name: 'Ravi Kumar', email: 'ravi@student.edu', role: 'Student', dept: 'Computer Science', active: true },
    { name: 'Dr. Sharma', email: 'sharma@univ.edu', role: 'Faculty', dept: 'Computer Science', active: true },
    { name: 'Priya Singh', email: 'priya@student.edu', role: 'Student', dept: 'Mathematics', active: true },
    { name: 'Prof. Reddy', email: 'reddy@univ.edu', role: 'Faculty', dept: 'Electronics', active: false },
  ];

  return (
    <div>
      <div className="filter-bar">
        <input className="search-input" placeholder="Search users..." />
        <select className="filter-select"><option>All Roles</option><option>Student</option><option>Faculty</option></select>
        <select className="filter-select"><option>All Departments</option><option>Computer Science</option><option>Mathematics</option><option>Physics</option></select>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'Faculty' ? 'badge-approved' : 'badge-pending'}`}>{u.role}</span></td>
                  <td>{u.dept}</td>
                  <td><span className={`badge ${u.active ? 'badge-approved' : 'badge-cancelled'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                  <td><button className="btn btn-ghost btn-sm">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
