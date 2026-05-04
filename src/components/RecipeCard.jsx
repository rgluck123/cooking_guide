import React from 'react';
import { Clock } from 'lucide-react';

const RecipeCard = ({ title, time, image, isBookLink = false, onClick }) => {
  if (isBookLink) {
    return (
      <div 
        onClick={onClick}
        style={{
          width: '140px',
          height: '220px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          flexShrink: 0,
          position: 'relative'
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100px" 
          height="140px" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="var(--text)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ position: 'absolute' }}
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        </svg>

        <span style={{ 
          position: 'relative',
          zIndex: 1,
          fontWeight: '700', 
          fontFamily: 'var(--heading)', 
          textAlign: 'center', 
          color: 'var(--text)',
          fontSize: '16px',
          lineHeight: '1.2',
          padding: '0 12px'
        }}>
          My Recipe Book
        </span>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      style={{
        width: '140px',
        height: '220px',
        borderRadius: '16px',
        backgroundColor: 'var(--surface)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        flexShrink: 0
      }}
    >
      {/* Top Half Image - Taller to give photo more space */}
      <div style={{
        width: '100%',
        height: '140px',
        backgroundImage: `url(${image || 'https://via.placeholder.com/150'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderBottom: '1px solid var(--border)'
      }} />
      
      {/* Bottom Half Text Area */}
      <div style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '14px', 
          fontFamily: 'var(--heading)', 
          color: 'var(--text)',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontWeight: '700'
        }}>
          {title}
        </h3>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          fontSize: '12px', 
          color: 'var(--accent-green)', 
          fontWeight: '700',
          marginTop: '6px'
        }}>
          <Clock size={14} />
          {time} min
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
