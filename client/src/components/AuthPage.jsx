import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { login, register } from '../api';
import './AuthPage.css';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'login';

  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', phone: '', designation: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(searchParams.get('mode') || 'login');
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      loginUser(data);
      showToast('✅', 'Signed in successfully!');
      navigate('/dashboard');
    } catch (err) {
      showToast('❌', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
        phone: form.phone,
        role
      };
      if (role === 'faculty') body.designation = form.designation;
      const data = await register(body);
      loginUser(data);
      showToast('🎉', 'Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      showToast('❌', err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">Unimeet</div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
        <p className="sub">{mode === 'login' ? 'Sign in to your account to continue' : 'Join Unimeet to get started'}</p>

        {/* Role Tabs */}
        <div className="role-tabs">
          {['student', 'faculty', 'admin'].map(r => (
            <div
              key={r}
              className={`role-tab ${role === r ? 'active' : ''}`}
              onClick={() => setRole(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </div>
          ))}
        </div>

        {mode === 'login' ? (
          <div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter password" value={form.password} onChange={handleChange} />
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
            <div className="auth-footer">
              Don't have an account? <a onClick={toggleMode}>Register here</a>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" name="department" placeholder="e.g. Computer Science" value={form.department} onChange={handleChange} />
              </div>
              <div className="form-group full-width">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Create password" value={form.password} onChange={handleChange} />
              </div>
              {role === 'student' && (
                <div className="form-group">
                  <label>Phone No.</label>
                  <input type="text" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
                </div>
              )}
              {role === 'faculty' && (
                <>
                  <div className="form-group">
                    <label>Phone No.</label>
                    <input type="text" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group full-width">
                    <label>Designation</label>
                    <input type="text" name="designation" placeholder="e.g. Associate Professor" value={form.designation} onChange={handleChange} />
                  </div>
                </>
              )}
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '8px' }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
            <div className="auth-footer">
              Already have an account? <a onClick={toggleMode}>Sign in</a>
            </div>
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <a className="text-muted" style={{ cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => navigate('/')}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
