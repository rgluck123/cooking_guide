import React from 'react';
import { X } from 'lucide-react';

const DeboningModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      title: "Feel the bone",
      instruction: "Use your thumb to find the bone running through the center.",
      image: "/cooking_guide/images/deboning/debone_step_1.png"
    },
    {
      title: "Slice along the bone",
      instruction: "Cut carefully and tightly against the bone's edge.",
      image: "/cooking_guide/images/deboning/debone_step_2.png"
    },
    {
      title: "Clear the joints",
      instruction: "Slide the knife tip under the joint to free it.",
      image: "/cooking_guide/images/deboning/debone_step_3.png"
    },
    {
      title: "Lift and remove",
      instruction: "Grip the bone and use the knife to slice it free.",
      image: "/cooking_guide/images/deboning/debone_step_4.png"
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
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, fontFamily: 'var(--heading)' }}>Deboning Steps</h2>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text)', textTransform: 'capitalize' }}>
                    {step.title}
                  </h3>
                  <p style={{ lineHeight: '1.5', margin: 0, color: 'var(--text-light)', fontWeight: '500', fontSize: '14px' }}>
                    {step.instruction}
                  </p>
                </div>
              </div>
              <div style={{ 
                width: '100%', 
                aspectRatio: '16 / 10', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1px solid var(--border)',
                backgroundColor: '#f5f5f5' // Placeholder while loading
              }}>
                <img 
                  src={step.image} 
                  alt={step.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: 'block'
                  }} 
                />
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
