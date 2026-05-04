import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, BookOpen, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={24} /> },
    { name: 'Search', path: '/results', icon: <Search size={24} /> },
    { name: 'My Book', path: '#', icon: <BookOpen size={24} /> },
    { name: 'Profile', path: '#', icon: <User size={24} /> }
  ];

  return (
    <div style={{
      position: 'sticky',
      bottom: 0,
      width: '100%',
      backgroundColor: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0 calc(12px + env(safe-area-inset-bottom))',
      zIndex: 50,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.03)',
      marginTop: 'auto'
    }}>
      {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <div 
            key={item.name}
            onClick={() => {
              if (item.path !== '#') navigate(item.path);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              color: isActive ? 'var(--accent-green)' : 'var(--text-light)',
              fontWeight: isActive ? '700' : '500',
              flex: 1
            }}
          >
            {item.icon}
            <span style={{ fontSize: '10px' }}>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;
