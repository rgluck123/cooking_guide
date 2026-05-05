import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Check, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

const SaveRecipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveRecipe, liveCookingDefaults } = useRecipes();
  const [recipeName, setRecipeName] = useState('Lebanese Spicy Chicken');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedModifications, setSelectedModifications] = useState(new Set());

  // Voice States
  const [voiceEnabled, setVoiceEnabled] = useState(liveCookingDefaults.micEnabled);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(liveCookingDefaults.voiceOverEnabled);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const loopTimeoutRef = useRef(null);

  // Get modifications from navigation state
  const modifications = location.state?.modifications || [];

  // Initialize all modifications as selected by default
  useEffect(() => {
    if (modifications.length > 0 && selectedModifications.size === 0) {
      const allIds = new Set(modifications.map(m => m.id));
      setSelectedModifications(allIds);
    }
  }, [modifications]);

  const toggleSelectModification = (id) => {
    setSelectedModifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSaveRecipe = () => {
    // Keep only selected modifications
    const activeModifications = modifications.filter(mod => selectedModifications.has(mod.id));
    
    const recipeData = {
      name: recipeName,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      time: '40 mins',
      portions: '2 portions',
      modifications: activeModifications,
      notes: notes,
      savedAt: new Date().toLocaleString()
    };

    saveRecipe(recipeData);
    if (voiceOutputEnabled) {
      const utterance = new SpeechSynthesisUtterance("Recipe saved successfully");
      window.speechSynthesis.speak(utterance);
    }
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  // Voice Interaction Logic
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      if (voiceEnabled) {
        loopTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && voiceEnabled) {
            try { recognitionRef.current.start(); } catch(e) {}
          }
        }, 500);
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Save Screen Voice Command:', transcript);

      // HOME SCREEN
      if (/(go to (the )?home screen( please)?|home screen|home page|go to (the )?home page( please)?|(please )?go to (the )?home page|(please )?go to (the )?home screen)/i.test(transcript)) {
        navigate('/');
      }
      // REMOVE INGREDIENT
      else if (transcript.startsWith('remove ')) {
        const ingredientName = transcript.replace('remove ', '').trim();
        const modToRemove = modifications.find(m => m.name.toLowerCase() === ingredientName);
        if (modToRemove) {
          // If it's in the set, remove it (uncheck)
          if (selectedModifications.has(modToRemove.id)) {
            toggleSelectModification(modToRemove.id);
            if (voiceOutputEnabled) {
              window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Removed ${ingredientName}`));
            }
          }
        }
      }
      // SAVE RECIPE
      else if (/save recipe/i.test(transcript)) {
        handleSaveRecipe();
      }
      // CONFIRM (Yes)
      else if (/^yes$/i.test(transcript)) {
        handleSaveRecipe();
      }
      // SPEECH OUTPUT TOGGLE
      else if (/(unmute|allow (voice|speech))/i.test(transcript)) {
        setVoiceOutputEnabled(true);
      }
      else if (/(mute|turn off (voice|speech)|disable (voice|speech))/i.test(transcript)) {
        setVoiceOutputEnabled(false);
      }
      // SAY AGAIN
      else if (/(again( please)?|(please )?(say )?again|(please )?speak again)/i.test(transcript)) {
        if (voiceOutputEnabled) {
          window.speechSynthesis.speak(new SpeechSynthesisUtterance("You are on the save recipe screen. You can say Save Recipe to finish."));
        }
      }
      // CLOSE / BACK
      else if (/(close|go to (the )?(recipe|step))/i.test(transcript)) {
        navigate(-1);
      }
    };

    recognitionRef.current = recognition;
    if (voiceEnabled) {
      try { recognition.start(); } catch(e) {}
    }

    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
      recognition.abort();
    };
  }, [voiceEnabled, modifications, selectedModifications, voiceOutputEnabled]);

  const toggleVoiceListening = () => {
    setVoiceEnabled(prev => {
      const nextValue = !prev;
      if (!nextValue) {
        window.speechSynthesis.cancel();
        if (loopTimeoutRef.current) {
          clearTimeout(loopTimeoutRef.current);
          loopTimeoutRef.current = null;
        }
        recognitionRef.current?.abort();
      } else {
        recognitionRef.current?.start?.();
      }
      return nextValue;
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg)',
      maxWidth: '480px',
      margin: '0 auto',
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {/* Header */}
      <header style={{ 
        padding: 'calc(24px + env(safe-area-inset-top)) 20px 12px',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '4px',
              color: 'var(--text)',
              display: 'flex'
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: 'var(--text)',
            margin: 0,
            fontFamily: 'var(--heading)'
          }}>
            Save Recipes
          </h1>
        </div>

        {/* Voice Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleVoiceListening}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              backgroundColor: voiceEnabled ? 'var(--accent-green-light)' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {voiceEnabled ? <Mic size={18} color="var(--accent-green)" /> : <MicOff size={18} color="var(--text-light)" />}
          </button>
          <button
            onClick={() => setVoiceOutputEnabled(prev => !prev)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              backgroundColor: voiceOutputEnabled ? 'var(--accent-green-light)' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {voiceOutputEnabled ? <Volume2 size={18} color="var(--accent-green)" /> : <VolumeX size={18} color="var(--text-light)" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {/* Recipe Image with Metadata */}
        <div style={{ 
          position: 'relative',
          marginBottom: '24px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: 'var(--surface)',
          border: '2px solid var(--border)',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" 
            alt="Lebanese Spicy Chicken"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          
          {/* Metadata Badges */}
          <div style={{ 
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '12px',
            zIndex: 10
          }}>
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '8px 12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text)'
            }}>
              ⏱️ 40mins
            </div>
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '8px 12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text)'
            }}>
              👥 2 portions
            </div>
          </div>
        </div>

        {/* Recipe Name */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: 'var(--text)',
            display: 'block',
            marginBottom: '8px'
          }}>
            Recipe Name
          </label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'var(--sans)',
              color: 'var(--text)',
              backgroundColor: 'var(--surface)',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        {/* Modifications - Only show if there are any */}
        {modifications.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: 'var(--text)',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>
              Modifications
            </h3>
            
            {modifications.map((mod) => {
              const isSelected = selectedModifications.has(mod.id);
              return (
                <div key={mod.id} style={{ marginBottom: '0' }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px dotted var(--border)',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleSelectModification(mod.id)}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{
                        marginTop: '4px',
                        cursor: 'pointer',
                        accentColor: 'var(--accent-green)'
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontSize: '14px',
                        color: isSelected ? 'var(--text)' : 'var(--text-light)',
                        fontWeight: isSelected ? '500' : '400'
                      }}>
                        {mod.name && mod.amount && `${mod.name} (${mod.amount})`}
                        {mod.name && !mod.amount && mod.name}
                        {!mod.name && mod.amount && `Added: ${mod.amount}`}
                      </div>
                      {mod.notes && (
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--text-light)',
                          marginTop: '2px'
                        }}>
                          {mod.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Notes Field */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: 'var(--text)',
            display: 'block',
            marginBottom: '8px'
          }}>
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add cooking notes or personal comments..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'var(--sans)',
              color: 'var(--text)',
              backgroundColor: 'var(--surface)',
              boxSizing: 'box-sizing',
              outline: 'none',
              minHeight: '80px',
              resize: 'none'
            }}
          />
        </div>

        {/* Info Message */}
        <p style={{
          fontSize: '13px',
          color: 'var(--text-light)',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          This will save a new version of the recipe with your modifications to your "📖 Recipe Book".
        </p>

        {/* Save Recipe Button */}
        <button
          onClick={handleSaveRecipe}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: 'var(--accent-green)',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            fontFamily: 'var(--sans)'
          }}
        >
          Save Recipe
        </button>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--accent-green)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: 'calc(480px - 40px)',
          width: 'calc(100% - 40px)',
          boxShadow: '0 4px 12px rgba(74, 107, 68, 0.3)',
          animation: 'slideUp 0.3s ease-out',
          zIndex: 1000
        }}>
          <Check size={20} />
          <span style={{ fontWeight: '600', fontSize: '16px' }}>Recipe saved successfully!</span>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SaveRecipe;
