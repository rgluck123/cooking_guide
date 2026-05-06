import React, { useState, useRef } from 'react';
import { Square, CheckSquare } from 'lucide-react';

const InteractiveIngredient = ({ item, onSwipeLeft, onSwipeRight, onLongPress, isSelectMode, isSelected, onToggleSelect, groupOffsetX, onGroupDrag, onGroupDragEnd }) => {
  const [localOffsetX, setLocalOffsetX] = useState(0);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const longPressTimer = useRef(null);
  const isDragging = useRef(false);

  const offsetX = groupOffsetX !== undefined ? groupOffsetX : localOffsetX;

  const updateOffset = (val) => {
    if (groupOffsetX !== undefined && onGroupDrag) {
      onGroupDrag(val);
    } else {
      setLocalOffsetX(val);
    }
  };

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = startXRef.current;
    isDragging.current = true;
    
    longPressTimer.current = setTimeout(() => {
      if (Math.abs(currentXRef.current - startXRef.current) < 10) {
        onLongPress(item);
        isDragging.current = false;
        updateOffset(0);
      }
    }, 500);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    currentXRef.current = e.touches[0].clientX;
    const deltaX = currentXRef.current - startXRef.current;
    
    if (Math.abs(deltaX) > 10 && longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (Math.abs(deltaX) < 20) {
      updateOffset(0);
      return;
    }

    const adjustedDelta = (deltaX > 0 ? deltaX - 20 : deltaX + 20) * 0.4;

    if (adjustedDelta > 100) updateOffset(100);
    else if (adjustedDelta < -100) updateOffset(-100);
    else updateOffset(adjustedDelta);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (offsetX < -50) {
      onSwipeLeft(item);
    } else if (offsetX > 50) {
      onSwipeRight(item);
    }
    
    if (groupOffsetX !== undefined && onGroupDragEnd) {
      onGroupDragEnd();
    } else {
      setLocalOffsetX(0);
    }
  };

  const handleMouseDown = (e) => {
    startXRef.current = e.clientX;
    currentXRef.current = startXRef.current;
    isDragging.current = true;
    
    longPressTimer.current = setTimeout(() => {
      if (Math.abs(currentXRef.current - startXRef.current) < 10) {
        onLongPress(item);
        isDragging.current = false;
        updateOffset(0);
      }
    }, 500);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    currentXRef.current = e.clientX;
    const deltaX = currentXRef.current - startXRef.current;
    
    if (Math.abs(deltaX) > 10 && longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (Math.abs(deltaX) < 20) {
      updateOffset(0);
      return;
    }

    const adjustedDelta = (deltaX > 0 ? deltaX - 20 : deltaX + 20) * 0.4;
    
    if (adjustedDelta > 100) updateOffset(100);
    else if (adjustedDelta < -100) updateOffset(-100);
    else updateOffset(adjustedDelta);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (offsetX < -50) {
      onSwipeLeft(item);
    } else if (offsetX > 50) {
      onSwipeRight(item);
    }

    if (groupOffsetX !== undefined && onGroupDragEnd) {
      onGroupDragEnd();
    } else {
      setLocalOffsetX(0);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
  };

  const isSubbed = item.edited || item.replacedIds;
  let bgIndicator = 'transparent';
  let indicatorText = '';

  if (offsetX < -20) {
    if (item.removed) {
      bgIndicator = 'var(--accent-green-light)';
      indicatorText = 'Restore';
    } else {
      bgIndicator = '#fff7ed';
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
          transition: isDragging.current ? 'none' : 'transform 0.3s ease, background-color 0.2s',
          boxShadow: 'var(--shadow)',
          cursor: 'grab',
          position: 'relative',
          zIndex: 1,
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isSelectMode ? (
            <div 
              onClick={(e) => { e.stopPropagation(); onToggleSelect(item.id); }} 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: isSelected ? 'var(--accent-green)' : '#A0A0A0', transition: 'color 0.4s ease', width: '24px', height: '24px' }}
            >
              {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
            </div>
          ) : (
            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.removed ? 'var(--text-light)' : 'var(--accent-green)' }} />
            </div>
          )}
          
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: item.removed ? 'var(--text-light)' : 'var(--text)',
              textDecoration: item.removed ? 'line-through' : 'none'
            }}>
              {item.name}
              {item.edited && <span style={{ fontSize: '12px', color: 'var(--accent-orange)', marginLeft: '8px', fontStyle: 'italic' }}>(edited)</span>}
              {item.replacedIds && <span style={{ fontSize: '12px', color: 'var(--accent-orange)', marginLeft: '8px', fontStyle: 'italic' }}>(group sub)</span>}
            </div>
            {item.assignedStep && (
              <div style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '2px', fontWeight: '600' }}>
                Added to step {item.assignedStep}
              </div>
            )}
            {item.originalName !== item.name && !item.replacedIds && (
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                Substituted for: {item.originalName}
              </div>
            )}
          </div>
        </div>
        <div style={{ fontWeight: '700', color: item.removed ? 'var(--text-light)' : 'var(--accent-green)', textDecoration: item.removed ? 'line-through' : 'none' }}>
          {item.quantity}
        </div>
      </div>
    </div>
  );
};

export default InteractiveIngredient;
