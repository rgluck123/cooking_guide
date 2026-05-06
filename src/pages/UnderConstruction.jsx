import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Hammer } from 'lucide-react';

const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(-1)}
      style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--bg)', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <button 
        style={{ 
          position: 'absolute', 
          top: 'calc(24px + env(safe-area-inset-top))', 
          left: '20px', 
          width: '44px', 
          height: '44px', 
          background: 'var(--surface)', 
          borderRadius: '50%', 
          border: '1px solid var(--border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: 'pointer',
          boxShadow: 'var(--shadow)',
          pointerEvents: 'none'
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginTop: '-15vh' 
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-green-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <Hammer size={40} color="var(--accent-green)" />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Page under construction</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-light)' }}>Tap to go back</p>
      </div>
    </div>
  );
};

export default UnderConstruction;
