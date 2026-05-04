import React from 'react';
import { X } from 'lucide-react';

const DeboningModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    "Place the chicken breast-side down on a cutting board.",
    "Make a slit down the center of the back, cutting to the bone.",
    "Using a sharp boning knife, scrape the meat away from the rib cage on one side.",
    "Pop the shoulder joint out of its socket and cut through it.",
    "Scrape down the wing bone, keeping the knife against the bone.",
    "Repeat on the other side of the rib cage.",
    "Cut through the thigh joints to separate the leg quarters from the carcass.",
    "Carefully scrape the meat off the thigh and drumstick bones."
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '20px',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: 'var(--bg)',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>Deboning Instructions</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="var(--text)" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px' }}>
              <div style={{ 
                width: '28px', height: '28px', 
                borderRadius: '50%', backgroundColor: 'var(--accent-green-light)', 
                color: 'var(--accent-green)', fontWeight: '800', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {i + 1}
              </div>
              <p style={{ lineHeight: '1.5', margin: 0, color: 'var(--text)', paddingTop: '2px' }}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeboningModal;