import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="brand">
        <span className="brand-badge" />
        <Link to="/events">Event Manager</Link>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <NavLink to="/events" className={({ isActive }) => (isActive ? 'active' : '')}>Events</NavLink>
        {user && <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>}
        {user && <NavLink to="/my-events" className={({ isActive }) => (isActive ? 'active' : '')}>My events</NavLink>}
        {!user ? (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>Register</NavLink>
          </>
        ) : (
          <button className="btn secondary" onClick={onLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}


