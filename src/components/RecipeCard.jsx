import React from 'react';
import { Clock, Book } from 'lucide-react';

const RecipeCard = ({ title, time, image, isBookLink = false, progress, isModified = false, onClick }) => {
  if (isBookLink) {
    return (
      <div 
        onClick={onClick}
        style={{
          width: '180px',
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
        {/* Custom Book SVG Background */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="180" 
          height="220" 
          viewBox="0 0 180 220" 
          fill="none" 
          stroke="var(--text)" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Next Page / Page Depth (Solid line placed very close to the cover) */}
          <path d="M157 14 V206 A8 8 0 0 1 149 210 H30" strokeWidth="0.8" />
          
          {/* Main Front Cover */}
          <rect x="20" y="10" width="135" height="200" rx="8" />
          
          {/* Spine Binding Details */}
          <line x1="35" y1="10" x2="35" y2="210" />
          <line x1="20" y1="30" x2="35" y2="30" />
          <line x1="20" y1="190" x2="35" y2="190" />

          {/* Bookmark Ribbon hanging out */}
          <path d="M 120 210 v 10 l -5 -4 l -5 4 v -10" fill="var(--text)" strokeWidth="0.8" />
        </svg>

        <span style={{ 
          position: 'relative',
          zIndex: 1,
          fontWeight: '800', 
          fontFamily: 'var(--heading)', 
          textAlign: 'center', 
          color: 'var(--text)',
          fontSize: '22px',
          lineHeight: '1.2',
          padding: '0 16px 0 24px',
          marginTop: '-10px' // Lift text slightly so ribbon is visible below
        }}>
          My<br/>Recipe<br/>Book
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
        flexShrink: 0,
        position: 'relative'
      }}
    >
      {/* Top Half Image - Taller to give photo more space */}
      <div style={{
        width: '100%',
        height: '140px',
        backgroundImage: `url(${image || 'https://via.placeholder.com/150'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative'
      }}>
        {/* Modified Indicator */}
        {isModified && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'var(--surface)',
            color: 'var(--accent-orange)',
            fontSize: '10px',
            fontWeight: '800',
            padding: '4px 8px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: '1px solid rgba(224, 122, 95, 0.3)',
            zIndex: 2,
            letterSpacing: '0.3px',
            textTransform: 'uppercase'
          }}>
            Modified
          </div>
        )}
      </div>
      
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

      {/* Bottom Progress Bar */}
      {typeof progress === 'number' && progress < 100 && (
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(74, 107, 68, 0.12)',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          overflow: 'hidden',
          position: 'absolute',
          bottom: 0,
          left: 0
        }}>
          <div style={{
            width: `${Math.max(progress, 2)}%`,
            height: '100%',
            backgroundColor: 'var(--accent-green)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
