import React from 'react';

const HorizontalScroll = ({ children, className = '', gap = '16px' }) => {
  return (
    <div 
      className={`no-scrollbar ${className}`}
      style={{
        display: 'flex',
        overflowX: 'auto',
        gap: gap,
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '16px',
        scrollSnapType: 'x mandatory',
        boxSizing: 'content-box',
        width: 'calc(100% - 40px)'
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