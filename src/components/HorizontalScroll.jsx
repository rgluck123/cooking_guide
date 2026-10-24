import React from 'react';

const HorizontalScroll = ({ children, className = '', gap = '16px' }) => {
  return (
    <div 
      className={`no-scrollbar ${className}`}
      style={{
        display: 'flex',
        overflowX: 'auto',
        gap: gap,
        paddingLeft: '12px',
        paddingRight: '20px',
        paddingBottom: '16px',
        scrollSnapType: 'x mandatory',
        scrollPaddingLeft: '20px',
        scrollPaddingRight: '20px',
        boxSizing: 'border-box',
        width: '100%',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div style={{ scrollSnapAlign: 'start', flexShrink: 0 }} key={index}>
          {child}
        </div>
      ))}
      {/* End spacer to ensure right padding is visible when scrolled to end */}
      <div style={{ minWidth: '4px', flexShrink: 0 }} aria-hidden="true" />
    </div>
  );
};

export default HorizontalScroll;