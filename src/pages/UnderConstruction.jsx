import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Hammer } from 'lucide-react';

const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg)', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <button 
        onClick={() => navigate(-1)} 
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
          boxShadow: 'var(--shadow)'
        }}
      >
        <ChevronLeft size={22} />
      </button>

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

      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px' }}>Page under construction</h1>

      <button 
        onClick={() => navigate(-1)}
        style={{
          marginTop: '32px',
          padding: '14px 48px',
          backgroundColor: 'white',
          color: 'var(--text)',
          border: '1.5px solid var(--text)',
          borderRadius: '999px',
          fontWeight: '600',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: 'var(--shadow)'
        }}
      >
        Go back
      </button>
    </div>
  );
};

export default UnderConstruction;
