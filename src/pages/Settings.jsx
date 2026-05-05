import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mic, Volume2 } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

const Settings = () => {
  const navigate = useNavigate();
  const { liveCookingDefaults, updateLiveCookingDefaults } = useRecipes();

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
      </div>
    </div>
  );
};

export default Settings;