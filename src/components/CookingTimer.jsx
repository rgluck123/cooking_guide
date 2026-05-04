import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const CookingTimer = ({ durationInSeconds }) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Reset timer if duration prop changes (i.e. moving to a new step)
    setTimeLeft(durationInSeconds);
    setIsActive(false);
  }, [durationInSeconds]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durationInSeconds);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '24px',
      backgroundColor: 'var(--surface)',
      borderRadius: '24px',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border)',
      width: '100%',
      maxWidth: '240px'
    }}>
      <div style={{ fontSize: '48px', fontWeight: '800', fontFamily: 'var(--heading)', color: 'var(--text)' }}>
        {formatTime(timeLeft)}
      </div>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={resetTimer}
          style={{
            width: '48px', height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--surface)',
            border: '2px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={20} color="var(--text-light)" />
        </button>

        <button 
          onClick={toggleTimer}
          style={{
            width: '48px', height: '48px',
            borderRadius: '50%',
            backgroundColor: isActive ? 'var(--accent-orange)' : 'var(--accent-green)',
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {isActive ? <Pause size={24} color="white" fill="white" /> : <Play size={24} color="white" fill="white" />}
        </button>
      </div>
    </div>
  );
};

export default CookingTimer;
