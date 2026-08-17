import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: 'grid', end: true },
  { to: '/users', label: 'Users', icon: 'users' },
  { to: '/tutors', label: 'Tutors', icon: 'tutor' },
  { to: '/students', label: 'Students', icon: 'student' },
  { to: '/parents', label: 'Parents', icon: 'users' },
  { to: '/packages', label: 'Packages', icon: 'package' },
  { to: '/enrollments', label: 'Enrollments', icon: 'check' },
  { to: '/courses', label: 'Courses', icon: 'book' },
  { to: '/payments', label: 'Payments', icon: 'wallet' },
  { to: '/referrals', label: 'Referrals', icon: 'gift' },
  { to: '/notifications', label: 'Announcements', icon: 'bell' },
  { to: '/content', label: 'Content CMS', icon: 'file' },
  { to: '/operations', label: 'Operations', icon: 'settings' },
  { to: '/schedule', label: 'Scheduling', icon: 'calendar' },
];

const Icon = ({ name }: { name: string }) => {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    tutor: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0M17 4l4-1-1 4"/></>,
    student: <><path d="m2 10 10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/></>,
    package: <><path d="m21 8-9 5-9-5M3 8l9-5 9 5v8l-9 5-9-5zM12 13v8"/></>,
    check: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 5.5v14"/></>,
    wallet: <><rect x="2" y="5" width="20" height="15" rx="2"/><path d="M16 13h6M2 9h20"/></>,
    gift: <><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M2 8h20M12 8H7.5a2.5 2.5 0 1 1 2.45-3c.4 1.5 2.05 3 2.05 3Zm0 0h4.5a2.5 2.5 0 1 0-2.45-3C13.65 6.5 12 8 12 8Z"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.1h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4h-.1v-4H3A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1v-.1h4V3A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.13.37.34.7.6 1 .27.28.63.42 1 .4h.1v4H21a1.7 1.7 0 0 0-1.6.6Z"/></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  };
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>;
};

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeLabel = NAV_ITEMS.find((item) => item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to))?.label || 'Admin';

  const onSignOut = async () => { await logout(); navigate('/login'); };
  const initials = (user?.email || 'Admin').slice(0, 2).toUpperCase();

  return (
    <div className="app-shell">
      {menuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
        <div className="brand-lockup"><div className="brand-mark">A</div><div><div className="sidebar-logo">ASCEND</div><div className="sidebar-tagline">TUITION</div></div></div>
        <div className="nav-section-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}><Icon name={item.icon} /><span>{item.label}</span></NavLink>)}
        </nav>
        <div className="sidebar-footer"><div className="sidebar-profile"><div className="avatar">{initials}</div><div className="profile-copy"><strong>Administrator</strong><span>{user?.email}</span></div></div><button className="sidebar-signout" onClick={onSignOut}>Sign out</button></div>
      </aside>
      <section className="workspace-shell">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}>☰</button><div><span className="topbar-eyebrow">Admin portal</span><strong>{activeLabel}</strong></div></div>
          <div className="topbar-actions"><div className="topbar-search"><span aria-hidden="true">⌕</span><input aria-label="Search portal" placeholder="Search anything" /></div><span className="portal-badge">Admin workspace</span><div className="avatar">{initials}</div></div>
        </header>
        <main className="main-content"><div className="content-inner"><Outlet /></div></main>
      </section>
    </div>
  );
};

export default Layout;
