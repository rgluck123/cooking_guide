import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Volume2, Mic, Settings as SettingsIcon, FlaskConical } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

const Settings = () => {
  const navigate = useNavigate();
  const { liveCookingDefaults, updateLiveCookingDefaults, testingMode, setTestingMode } = useRecipes();
  const [showTestingMode, setShowTestingMode] = useState(false);
  const longPressTimer = useRef(null);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      setShowTestingMode(true);
    }, 1500); // 1.5 seconds for hidden trigger
  };

  const endLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };


  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(24px + env(safe-area-inset-top)) 20px 16px', position: 'sticky', top: 0, backgroundColor: 'var(--bg)', zIndex: 10, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={28} color="var(--text)" />
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Settings</h1>
        <div style={{ width: '28px' }} />
      </header>

      <div style={{ padding: '20px' }}>
        <div style={{ padding: '16px', borderRadius: '20px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Live Cooking Mode</h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Volume2 size={18} color="var(--accent-green)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>Start with voice over</div>
              </div>
            </div>
            <button
              onClick={() => updateLiveCookingDefaults({ voiceOverEnabled: !liveCookingDefaults.voiceOverEnabled })}
              aria-pressed={liveCookingDefaults.voiceOverEnabled}
              style={{ width: '48px', height: '28px', borderRadius: '999px', border: 'none', backgroundColor: liveCookingDefaults.voiceOverEnabled ? 'var(--accent-green)' : 'var(--border)', position: 'relative', cursor: 'pointer', padding: 0, flexShrink: 0 }}
            >
              <span style={{ position: 'absolute', top: '3px', left: liveCookingDefaults.voiceOverEnabled ? '24px' : '3px', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mic size={18} color="var(--accent-green)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>Start with microphone on</div>
              </div>
            </div>
            <button
              onClick={() => updateLiveCookingDefaults({ micEnabled: !liveCookingDefaults.micEnabled })}
              aria-pressed={liveCookingDefaults.micEnabled}
              style={{ width: '48px', height: '28px', borderRadius: '999px', border: 'none', backgroundColor: liveCookingDefaults.micEnabled ? 'var(--accent-green)' : 'var(--border)', position: 'relative', cursor: 'pointer', padding: 0, flexShrink: 0 }}
            >
              <span style={{ position: 'absolute', top: '3px', left: liveCookingDefaults.micEnabled ? '24px' : '3px', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }} />
            </button>
          </div>
        </div>
      {/* Hidden Trigger Area */}
      <div 
        onMouseDown={startLongPress}
        onMouseUp={endLongPress}
        onMouseLeave={endLongPress}
        onTouchStart={startLongPress}
        onTouchEnd={endLongPress}
        style={{ height: '60px', marginTop: '20px', cursor: 'default' }}
      >
        {showTestingMode && (
          <div style={{ padding: '16px', borderRadius: '20px', backgroundColor: 'var(--surface)', border: '1.5px dashed var(--accent-orange)', boxShadow: 'var(--shadow)', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FlaskConical size={18} color="var(--accent-orange)" />
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-orange)' }}>User Testing Mode</div>
              </div>
              <button
                onClick={() => setTestingMode(!testingMode)}
                style={{ width: '48px', height: '28px', borderRadius: '999px', border: 'none', backgroundColor: testingMode ? 'var(--accent-orange)' : 'var(--border)', position: 'relative', cursor: 'pointer', padding: 0, flexShrink: 0 }}
              >
                <span style={{ position: 'absolute', top: '3px', left: testingMode ? '24px' : '3px', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s ease' }} />
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '8px', lineHeight: '1.4' }}>Skips steps between 'Stir onion' and the final plate. Restart app to hide this setting again.</p>
          </div>
        )}
      </div>
      </div>
      <style>{`
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      `}</style>
      </div>
      );
      };

      export default Settings;