import React from 'react';

const HorizontalScroll = ({ children, className = '' }) => {
  return (
    <div 
      className={`no-scrollbar ${className}`}
      style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '16px',
        padding: '0 20px 16px 20px',
        scrollSnapType: 'x mandatory',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div style={{ scrollSnapAlign: 'start', flexShrink: 0 }} key={index}>
          {child}
        </div>
      ))}
      <div style={{ minWidth: '4px', flexShrink: 0 }} aria-hidden="true" />
    </div>
  );
};

export default HorizontalScroll;