import React, { useState, useRef } from 'react';
import { Square, CheckSquare } from 'lucide-react';

const InteractiveIngredient = ({ item, onSwipeLeft, onSwipeRight, onLongPress }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const longPressTimer = useRef(null);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = startXRef.current;
    isDragging.current = true;
    
    // Start long press timer (500ms)
    longPressTimer.current = setTimeout(() => {
      // If user hasn't moved finger much, trigger long press
      if (Math.abs(currentXRef.current - startXRef.current) < 10) {
        onLongPress(item);
        isDragging.current = false; // Cancel potential swipe
        setOffsetX(0);
      }
    }, 500);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    currentXRef.current = e.touches[0].clientX;
    const deltaX = currentXRef.current - startXRef.current;
    
    // Constrain visual drag
    if (deltaX > 100) setOffsetX(100);
    else if (deltaX < -100) setOffsetX(-100);
    else setOffsetX(deltaX);
    
    // Cancel long press if finger moves significantly
    if (Math.abs(deltaX) > 10 && longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    if (!isDragging.current) return;
    isDragging.current = false;
    
    // Trigger actions based on thresholds
    if (offsetX < -60) {
      onSwipeLeft(item);
    } else if (offsetX > 60) {
      onSwipeRight(item);
    }
    
    // Snap back
    setOffsetX(0);
  };

  // Mouse fallback for testing on desktop
  const handleMouseDown = (e) => {
    startXRef.current = e.clientX;
    currentXRef.current = startXRef.current;
    isDragging.current = true;
    
    longPressTimer.current = setTimeout(() => {
      if (Math.abs(currentXRef.current - startXRef.current) < 10) {
        onLongPress(item);
        isDragging.current = false;
        setOffsetX(0);
      }
    }, 500);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    currentXRef.current = e.clientX;
    const deltaX = currentXRef.current - startXRef.current;
    
    if (deltaX > 100) setOffsetX(100);
    else if (deltaX < -100) setOffsetX(-100);
    else setOffsetX(deltaX);
    
    if (Math.abs(deltaX) > 10 && longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (offsetX < -60) {
      onSwipeLeft(item);
    } else if (offsetX > 60) {
      onSwipeRight(item);
    }
    setOffsetX(0);
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
  };

  // Determine background color based on swipe direction to preview action
  let bgIndicator = 'transparent';
  let indicatorText = '';
  if (offsetX < -30) {
    bgIndicator = '#fee2e2'; // light red
    indicatorText = 'Delete';
  } else if (offsetX > 30) {
    bgIndicator = 'var(--accent-green-light)';
    indicatorText = 'Substitute';
  }

  return (
    <div style={{ position: 'relative', marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', backgroundColor: bgIndicator }}>
      
      {/* Background Indicators (visible when swiping) */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: offsetX > 0 ? 'flex-start' : 'flex-end', padding: '0 20px', fontWeight: '700', color: offsetX > 0 ? 'var(--accent-green)' : '#ef4444', opacity: Math.abs(offsetX) / 60 }}>
        {indicatorText}
      </div>

      {/* Main Ingredient Row */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          transform: `translateX(${offsetX}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.3s ease',
          boxShadow: 'var(--shadow)',
          cursor: 'grab',
          position: 'relative',
          zIndex: 1,
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div onClick={(e) => { e.stopPropagation(); setIsChecked(!isChecked); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: isChecked ? 'var(--accent-green)' : 'var(--text-light)' }}>
            {isChecked ? <CheckSquare size={24} /> : <Square size={24} />}
          </div>
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: isChecked ? 'var(--text-light)' : 'var(--text)'
            }}>
              {item.name}
              {item.edited && <span style={{ fontSize: '12px', color: 'var(--accent-orange)', marginLeft: '8px', fontStyle: 'italic' }}>(edited)</span>}
            </div>
            {item.originalName !== item.name && (
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                Substituted for: {item.originalName}
              </div>
            )}
          </div>
        </div>
        <div style={{ fontWeight: '700', color: isChecked ? 'var(--text-light)' : 'var(--accent-green)' }}>
          {item.quantity}
        </div>
      </div>
    </div>
  );
};

export default InteractiveIngredient;
