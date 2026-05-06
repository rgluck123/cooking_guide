import React from 'react';
import { X } from 'lucide-react';

const DeboningModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      instruction: "Let the cooked chicken cool for a few minutes until it's safe to handle.",
      image: "https://images.unsplash.com/photo-1626082895617-2c6de34f6af3?auto=format&fit=crop&w=400&q=80"
    },
    {
      instruction: "Carefully remove all bones and skin from the thighs.",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80"
    },
    {
      instruction: "Shred the meat into bite-sized pieces using two forks.",
      image: "https://images.unsplash.com/photo-1585325701165-351af9ad665e?auto=format&fit=crop&w=400&q=80"
    },
    {
      instruction: "Work slowly to ensure no small bones remain in the shredded meat.",
      image: "https://images.unsplash.com/photo-1614398751058-eb2e0bf63e53?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '20px',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: 'var(--bg)',
        borderRadius: '28px',
        padding: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, fontFamily: 'var(--heading)' }}>Tips for Deboning</h2>
          <button onClick={onClose} style={{ background: 'var(--accent-green-light)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={20} color="var(--accent-green)" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '28px', height: '28px', 
                  borderRadius: '50%', backgroundColor: 'var(--accent-green)', 
                  color: 'white', fontWeight: '800', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontSize: '14px'
                }}>
                  {i + 1}
                </div>
                <p style={{ lineHeight: '1.5', margin: 0, color: 'var(--text)', fontWeight: '600', fontSize: '15px' }}>
                  {step.instruction}
                </p>
              </div>
              <div style={{ width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={step.image} alt={`Step ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '32px',
            padding: '16px',
            backgroundColor: 'var(--accent-green)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default DeboningModal;
