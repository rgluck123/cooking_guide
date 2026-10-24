import React, { useState, useRef } from 'react';
import { Square, CheckSquare } from 'lucide-react';

const InteractiveIngredient = ({ item, onSwipeLeft, onSwipeRight, onLongPress, isSelectMode, isSelected, onToggleSelect, groupOffsetX, onGroupDrag, onGroupDragEnd }) => {
  const [dragX, setDragX] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const isLongPressActive = useRef(false);
  const longPressTimer = useRef(null);

  const isSubbed = item.edited || item.replacedIds;

  const handleTouchStart = (e) => {
    if (isSelectMode && !isSelected) return;
    isDragging.current = true;
    startX.current = e.touches[0].clientX - dragX;
    
    longPressTimer.current = setTimeout(() => {
      isLongPressActive.current = true;
      onLongPress(item);
    }, 500);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    
    if (Math.abs(diff) > 10) {
      clearTimeout(longPressTimer.current);
    }
    
    setDragX(diff);
    if (onGroupDrag && isSelected) onGroupDrag(diff);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    clearTimeout(longPressTimer.current);
    
    if (isLongPressActive.current) {
      isLongPressActive.current = false;
      setDragX(0);
      if (onGroupDragEnd) onGroupDragEnd();
      return;
    }

    if (dragX > 60) {
      onSwipeRight(item);
    } else if (dragX < -60) {
      onSwipeLeft(item);
    }
    
    setDragX(0);
    if (onGroupDragEnd) onGroupDragEnd();
  };

  const handleMouseDown = (e) => {
    if (isSelectMode && !isSelected) return;
    isDragging.current = true;
    startX.current = e.clientX - dragX;
    
    longPressTimer.current = setTimeout(() => {
      isLongPressActive.current = true;
      onLongPress(item);
    }, 500);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 10) clearTimeout(longPressTimer.current);
    setDragX(diff);
    if (onGroupDrag && isSelected) onGroupDrag(diff);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    clearTimeout(longPressTimer.current);
    if (isLongPressActive.current) {
      isLongPressActive.current = false;
      setDragX(0);
      if (onGroupDragEnd) onGroupDragEnd();
      return;
    }
    if (dragX > 60) onSwipeRight(item);
    else if (dragX < -60) onSwipeLeft(item);
    setDragX(0);
    if (onGroupDragEnd) onGroupDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging.current) handleMouseUp();
  };

  const offsetX = groupOffsetX !== undefined ? groupOffsetX : dragX;
  
  let bgIndicator = 'transparent';
  let indicatorText = '';
  
  if (offsetX < -20) {
    if (item.removed) {
      bgIndicator = 'var(--accent-green-light)';
      indicatorText = 'Restore';
    } else {
      bgIndicator = '#fee2e2';
      indicatorText = 'Remove';
    }
  } else if (offsetX > 20) {
    if (isSubbed) {
      bgIndicator = '#fff7ed';
      indicatorText = 'Reset';
    } else {
      bgIndicator = 'var(--accent-green-light)';
      indicatorText = 'Substitute';
    }
  }

  const indicatorColor = bgIndicator === '#fff7ed' ? '#c2410c' : 'var(--accent-green)';

  return (
    <div style={{ position: 'relative', marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', backgroundColor: bgIndicator }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: offsetX > 0 ? 'flex-start' : 'flex-end', padding: '0 20px', fontWeight: '700', color: indicatorColor, opacity: Math.abs(offsetX) / 50 }}>
        {indicatorText}
      </div>

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
          backgroundColor: item.removed ? '#f6f6f4' : (isSelected ? 'var(--accent-green-light)' : 'var(--surface)'),
          borderRadius: '12px',
          border: isSelected ? '1px solid var(--accent-green)' : '1px solid var(--border)',
          transform: `translateX(${offsetX}px)`,
          transition: (isDragging.current || (groupOffsetX !== undefined && groupOffsetX !== 0)) ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.2s',
          boxShadow: (isDragging.current || (groupOffsetX !== undefined && groupOffsetX !== 0)) ? '0 4px 12px rgba(0,0,0,0.1)' : 'var(--shadow)',
          cursor: 'grab',
          position: 'relative',
          zIndex: 1,
          userSelect: 'none',
          touchAction: 'none',
          minHeight: '64px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {isSelectMode ? (
            <div 
              onClick={(e) => { e.stopPropagation(); onToggleSelect(item.id); }} 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: isSelected ? '#2D4529' : '#555555', width: '24px', height: '24px', flexShrink: 0 }}
            >
              {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
            </div>
          ) : (
            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                backgroundColor: 'transparent',
                border: '1px solid var(--text)' 
              }} />
            </div>
          )}
          
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: 'var(--text)',
              textDecoration: item.removed ? 'line-through' : 'none'
            }}>
              {item.name}
            </div>
            {(item.edited || item.replacedIds) && (
              <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '1px' }}>
                {item.replacedIds ? 'Substituted Group' : 'Substituted'}
              </div>
            )}
          </div>
        </div>

        <div style={{ fontSize: '15px', fontWeight: '700', color: item.removed ? 'var(--text-light)' : 'var(--accent-green)', textDecoration: item.removed ? 'line-through' : 'none', marginLeft: '12px', flexShrink: 0 }}>
          {item.quantity}
        </div>
      </div>
    </div>
  );
};

export default InteractiveIngredient;
