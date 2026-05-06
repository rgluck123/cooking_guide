import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Mic, MicOff, Pencil, Volume2, VolumeX, Info } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import CookingTimer from '../components/CookingTimer';
import DeboningModal from '../components/DeboningModal';

const LiveCooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addRecent, liveCookingDefaults, recipeProgress, updateProgress, clearProgress, activeRecipe, setActiveRecipeById, testingMode } = useRecipes();
  
  const recipeId = location.state?.recipeId || 'authentic-lebanese-chicken';

  useEffect(() => {
    if (!activeRecipe || activeRecipe.id !== recipeId) {
      setActiveRecipeById(recipeId);
    }
  }, [recipeId, activeRecipe, setActiveRecipeById]);

  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const progress = recipeProgress[recipeId];
    return progress ? progress.currentStep : 0;
  });

  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isDeboneModalOpen, setIsDeboneModalOpen] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [modifications, setModifications] = useState([]);
  const [modifyInput, setModifyInput] = useState({ name: '', amount: '', notes: '' });
  const [voiceEnabled, setVoiceEnabled] = useState(liveCookingDefaults.micEnabled);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(liveCookingDefaults.voiceOverEnabled);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const loopTimeoutRef = useRef(null);
  const touchStartX = useRef(0);

  const allVisibleSteps = useMemo(() => {
    return activeRecipe?.steps.filter(step => {
      const stepIngredients = activeRecipe.ingredients.filter(ing => 
        ing.assignedSteps && ing.assignedSteps.includes(step.id)
      );
      if (stepIngredients.length === 0) return true;
      return stepIngredients.some(ing => !ing.removed);
    }) || [];
  }, [activeRecipe]);

  const visibleSteps = useMemo(() => {
    if (!testingMode || allVisibleSteps.length === 0) return allVisibleSteps;
    const stirStepIndex = allVisibleSteps.findIndex(s => s.id === 6);
    const finalStepIndex = allVisibleSteps.findIndex(s => s.id === 11);
    if (stirStepIndex === -1 || finalStepIndex === -1) return allVisibleSteps;
    return allVisibleSteps.filter((s, idx) => idx <= stirStepIndex || idx >= finalStepIndex);
  }, [allVisibleSteps, testingMode]);

  const step = visibleSteps[currentStepIndex] || visibleSteps[0];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === visibleSteps.length - 1;
  const progressPercent = useMemo(() => {
    if (allVisibleSteps.length === 0 || !step) return 0;
    const actualStepIndex = allVisibleSteps.findIndex(s => s.id === step.id);
    return ((actualStepIndex + 1) / allVisibleSteps.length) * 100;
  }, [allVisibleSteps, step]);

  const stepIngredients = useMemo(() => {
    return activeRecipe?.ingredients.filter(ing => 
      ing.assignedSteps && ing.assignedSteps.includes(step?.id) && !ing.removed && !ing.hidden
    ) || [];
  }, [activeRecipe, step]);

  const currentStepModifications = useMemo(() => {
    return modifications.filter(mod => mod.stepId === step?.id);
  }, [modifications, step]);

  const handleUndoModification = (modId) => {
    setModifications(prev => prev.filter(m => m.id !== modId));
  };

  const handleSaveModification = () => {
    if (modifyInput.name || modifyInput.amount || modifyInput.notes) {
      setModifications(prev => [...prev, { 
        id: Date.now(), 
        ...modifyInput, 
        stepId: step?.id 
      }]);
      setModifyInput({ name: '', amount: '', notes: '' });
    }
    setIsModifyModalOpen(false);
  };

  const handleExit = useCallback(() => {
    try { window.speechSynthesis.cancel(); } catch(e) { /* ignore */ }
    if (visibleSteps.length > 0) {
      updateProgress(recipeId, currentStepIndex, visibleSteps.length);
    }
    navigate('/');
  }, [navigate, visibleSteps.length, updateProgress, recipeId, currentStepIndex]);

  useEffect(() => {
    if (visibleSteps.length > 0) {
      updateProgress(recipeId, currentStepIndex, visibleSteps.length);
    }
  }, [currentStepIndex, recipeId, updateProgress, visibleSteps.length]);

  const nextStep = () => {
    if (isLastStep) {
      setShowSavePrompt(true);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  const prevStep = () => !isFirstStep && setCurrentStepIndex(prev => prev - 1);

  const speakStep = useCallback(() => {
    if (!voiceSupported || !voiceOutputEnabled || !step) return;
    const utterance = new SpeechSynthesisUtterance(`${step.title}. ${step.instruction}`);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    try { window.speechSynthesis.cancel(); } catch(e) { /* ignore */ }
    window.speechSynthesis.speak(utterance);
  }, [voiceSupported, voiceOutputEnabled, step]);

  const currentStepIndexRef = useRef(currentStepIndex);
  const showSavePromptRef = useRef(showSavePrompt);
  const modificationsRef = useRef(modifications);

  useEffect(() => {
    currentStepIndexRef.current = currentStepIndex;
    showSavePromptRef.current = showSavePrompt;
    modificationsRef.current = modifications;
  }, [currentStepIndex, showSavePrompt, modifications]);

  useEffect(() => {
    if (!activeRecipe || visibleSteps.length === 0) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onend = () => {
      if (voiceEnabled) {
        loopTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && voiceEnabled) {
            try { recognitionRef.current.start(); } catch(e) { /* ignore */ }
          }
        }, 500);
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      
      if (isModifyModalOpen) {
        if (/(save changes|save|confirm|yes)/i.test(transcript)) {
          handleSaveModification();
          return;
        }
        if (/(cancel|close|dismiss|no)/i.test(transcript)) {
          setIsModifyModalOpen(false);
          return;
        }
        if (/(ginger|chili|pepper|salt|cumin|coriander|cinnamon)/i.test(transcript) && !transcript.includes(' ')) {
          setModifyInput(prev => ({ ...prev, name: transcript }));
          if (voiceOutputEnabled) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Set ingredient to ${transcript}`));
          }
          return;
        }
      }

      if (/(next step|next|done|ok done|go ahead|next screen|go further|i am ready|all done)/i.test(transcript)) {
        if (currentStepIndexRef.current === visibleSteps.length - 1) {
          setShowSavePrompt(true);
        } else {
          setCurrentStepIndex(prev => prev + 1);
        }
      }
      else if (/(previous step|previous|back|go back|last step|last screen)/i.test(transcript)) {
        if (isModifyModalOpen || isDeboneModalOpen || showSavePromptRef.current) {
          setIsModifyModalOpen(false);
          setIsDeboneModalOpen(false);
          setShowSavePrompt(false);
        } else if (currentStepIndexRef.current > 0) {
          setCurrentStepIndex(prev => prev - 1);
        }
      }
      else if (/(home screen|home page)/i.test(transcript)) {
        handleExit();
      }
      else if (/(modify|do modification|put modification)/i.test(transcript)) {
        setIsModifyModalOpen(true);
      }
      else if (/(start|launch|set) (the )?timer|start (the )?countdown/i.test(transcript)) {
        timerRef.current?.start();
      }
      else if (/(pause|stop|halt) (the )?timer|pause|pause (the )?time|stop (the )?time/i.test(transcript)) {
        timerRef.current?.pause();
      }
      else if (/reset (the )?(timer|time)/i.test(transcript)) {
        timerRef.current?.reset();
      }
      else if (/(help|more info|more information|more instructions)/i.test(transcript)) {
        if (step?.id === 2) setIsDeboneModalOpen(true);
      }
      else if (/(show )?recipe overview|show (all )?recipe steps/i.test(transcript)) {
        navigate('/recipe-overview', { state: { recipeId } });
      }
      else if (/(close|go to recipe|go to step)/i.test(transcript)) {
        setIsModifyModalOpen(false);
        setIsDeboneModalOpen(false);
        setShowSavePrompt(false);
      }
      else if (transcript.startsWith('add ') || transcript.startsWith('include ') || transcript.startsWith('remove ')) {
        const isRemove = transcript.startsWith('remove ');
        const itemName = transcript.replace(/^(add|include|remove) /, '').trim();
        
        if (isRemove) {
          // Find the ingredient in the current step and "remove" it (hide it)
          // This is a bit complex as it affects the activeRecipe state which is in context.
          // For now, let's just speak a confirmation if it was a modification we added.
          const modToUndo = modificationsRef.current.find(m => m.name.toLowerCase() === itemName && m.stepId === step?.id);
          if (modToUndo) {
            handleUndoModification(modToUndo.id);
            if (voiceOutputEnabled) {
              const utterance = new SpeechSynthesisUtterance(`Removed ${itemName}`);
              window.speechSynthesis.speak(utterance);
            }
          }
        } else if (itemName) {
          setModifications(prev => [...prev, {
            id: Date.now(),
            name: itemName,
            amount: '',
            notes: '',
            stepId: step?.id
          }]);
          if (voiceOutputEnabled) {
            const utterance = new SpeechSynthesisUtterance(`Added ${itemName}`);
            window.speechSynthesis.speak(utterance);
          }
        }
      }
      else if (/(unmute|allow voice|allow speech)/i.test(transcript)) {
        setVoiceOutputEnabled(true);
      }
      else if (/(mute|turn off voice|turn off speech|disable voice|disable speech)/i.test(transcript)) {
        setVoiceOutputEnabled(false);
        try { window.speechSynthesis.cancel(); } catch(e) { /* ignore */ }
      }
      else if (/(again|say again|speak again)/i.test(transcript)) {
        speakStep();
      }
      else if (/(yes|sure|save it|save recipe)/i.test(transcript)) {
        if (showSavePromptRef.current || /save recipe/i.test(transcript)) {
          // ...
          addRecent({
            id: 'authentic-lebanese-chicken',
            name: 'Authentic Lebanese Chicken with Rice',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
            time: '40 mins',
            portions: '2 portions'
          });
          setShowSavePrompt(false);
          navigate('/save-recipe', { state: { modifications: modificationsRef.current } });
        }
      }
    };

    recognitionRef.current = recognition;
    if (voiceEnabled) {
      try { recognition.start(); } catch(e) { /* ignore */ }
    }

    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
      try { recognitionRef.current?.abort(); } catch(e) { /* ignore */ }
    };
  }, [voiceEnabled, activeRecipe, visibleSteps.length, addRecent, navigate, recipeId, speakStep, handleExit, isModifyModalOpen, isDeboneModalOpen, handleSaveModification, voiceOutputEnabled, step]); 

  // Use a slight delay on initial mount to ensure Speech Synthesis is ready to speak the first step.
  useEffect(() => {
    const timer = setTimeout(() => {
      speakStep();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentStepIndex, speakStep]);

  const toggleVoiceListening = async () => {
    if (!voiceEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) { return; }
    }

    setVoiceEnabled(prev => {
      const nextValue = !prev;
      if (!nextValue) {
        if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
        try { recognitionRef.current?.abort(); } catch(e) { /* ignore */ }
      } else {
        try { recognitionRef.current?.start?.(); } catch(e) { /* ignore */ }
      }
      return nextValue;
    });
  };

  if (!activeRecipe || visibleSteps.length === 0) return null;

  return (
    <div 
      style={{ height: '100dvh', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      onTouchStart={(e) => { 
        if (isModifyModalOpen || isDeboneModalOpen || showSavePrompt) return;
        touchStartX.current = e.touches[0].clientX; 
      }}
      onTouchEnd={(e) => {
        if (isModifyModalOpen || isDeboneModalOpen || showSavePrompt) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX.current - touchEndX;
        if (diffX > 50) nextStep();
        if (diffX < -50) prevStep();
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: 'calc(20px + env(safe-area-inset-top)) 20px 12px', gap: '12px' }}>
          <button onClick={handleExit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '50%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow)', flexShrink: 0 }}>
            <Home size={24} color="var(--text)" />
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginLeft: 'auto' }}>
            <button
              onClick={toggleVoiceListening}
              style={{ minWidth: '44px', minHeight: '44px', borderRadius: '999px', border: `1.5px solid ${voiceEnabled ? 'var(--accent-green)' : 'var(--border)'}`, backgroundColor: voiceEnabled ? 'var(--accent-green-light)' : 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: voiceEnabled ? 'var(--shadow)' : 'none' }}
            >
              {voiceEnabled ? <Mic size={18} color="var(--accent-green)" /> : <MicOff size={18} color="var(--text-light)" />}
            </button>

            <button
              onClick={() => {
                const next = !voiceOutputEnabled;
                setVoiceOutputEnabled(next);
                if (!next) try { window.speechSynthesis.cancel(); } catch(e) { /* ignore */ }
              }}
              style={{ minWidth: '44px', minHeight: '44px', borderRadius: '999px', border: '1px solid var(--border)', backgroundColor: voiceOutputEnabled ? 'var(--accent-green-light)' : 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow)' }}
            >
              {voiceOutputEnabled ? <Volume2 size={18} color="var(--accent-green)" /> : <VolumeX size={18} color="var(--text-light)" />}
            </button>
          </div>
        </header>

        <div style={{ padding: '0 20px 10px', flexShrink: 0 }}>
          <div style={{ height: '8px', borderRadius: '999px', backgroundColor: 'var(--accent-green-light)', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', borderRadius: '999px', backgroundColor: 'var(--accent-green)' }} />
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px', marginBottom: '8px' }}>
            <h2 style={{ fontFamily: 'var(--heading)', fontSize: '28px', fontWeight: '700', color: 'var(--text)', margin: 0, lineHeight: 1.3 }}>
              {step?.title}
            </h2>
            {step?.id === 2 && (
              <button 
                onClick={() => setIsDeboneModalOpen(true)}
                style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Info size={20} color="var(--accent-green)" />
              </button>
            )}
          </div>

          <p style={{ fontSize: '15px', color: 'var(--text-light)', lineHeight: '1.8', marginTop: '6px', marginBottom: '20px', textAlign: 'center' }}>
            {step?.instruction}
          </p>

          {(stepIngredients.length > 0 || currentStepModifications.length > 0) && (
            <div style={{ marginBottom: '24px', padding: '16px 20px', backgroundColor: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow)' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', opacity: 0.7 }}>Ingredients for this step</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stepIngredients.map(ing => (
                  <div key={ing.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text)', fontSize: '15px', fontWeight: '600' }}>
                    <span>{ing.name}</span>
                    <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>{ing.quantity}</span>
                  </div>
                ))}
                {currentStepModifications.map(mod => (
                  <div key={mod.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text)', fontSize: '15px', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span>{mod.name} (modified)</span>
                      <button 
                        onClick={() => handleUndoModification(mod.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', padding: '2px 4px', cursor: 'pointer', opacity: 0.6 }}
                      >
                        Undo
                      </button>
                    </div>
                    {mod.amount && <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>{mod.amount}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step && ![1, 2, 5, 7, 9].includes(step.id) && (
            <div style={{ width: '100%', height: '280px', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}>
              <img src={step.image} alt={step.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {step?.id === 2 && (
              <button onClick={() => setIsDeboneModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '999px', backgroundColor: 'white', border: '1.5px solid var(--accent-green)', color: 'var(--accent-green)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: 'var(--shadow)' }}>
                <Info size={18} />
                More instructions
              </button>
            )}

            <button onClick={() => setIsModifyModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '999px', backgroundColor: 'var(--accent-green-light)', border: '1.5px solid var(--accent-green)', color: 'var(--accent-green)', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
              <Pencil size={16} />
              Modify
            </button>
          </div>

          {step?.hasTimer && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <CookingTimer ref={timerRef} durationInSeconds={step.timerSeconds} />
            </div>
          )}
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 20px calc(16px + env(safe-area-inset-bottom))', backgroundColor: 'var(--bg)', borderTop: '1px solid rgba(234, 234, 234, 0.8)' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={prevStep} disabled={isFirstStep} style={{ flex: 1, minHeight: '48px', borderRadius: '999px', backgroundColor: 'white', color: 'var(--text)', border: '1.5px solid var(--text)', fontWeight: '600', fontSize: '14px', opacity: isFirstStep ? 0.4 : 1 }}>
            ← Previous
          </button>
          <button onClick={nextStep} style={{ flex: 1, minHeight: '48px', borderRadius: '999px', backgroundColor: 'var(--text)', color: 'white', border: 'none', fontWeight: '600', fontSize: '14px' }}>
            {isLastStep ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>

      {isModifyModalOpen && (
        <div 
          onClick={() => setIsModifyModalOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', padding: '20px' }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'var(--surface)', borderRadius: '25px', padding: '20px', maxWidth: '480px', width: 'calc(100% - 40px)', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #1b1b1b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', margin: 0, fontFamily: 'var(--heading)' }}>Modify Ingredient</h2>
              <button onClick={() => setIsModifyModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text)', padding: 0 }}>✕</button>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Ingredient name</label>
              <input type="text" placeholder="e.g., chili pepper" value={modifyInput.name} onChange={(e) => setModifyInput({...modifyInput, name: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', color: 'var(--text)', backgroundColor: 'var(--bg)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Amount</label>
              <input type="text" placeholder="e.g., 1 tablespoon" value={modifyInput.amount} onChange={(e) => setModifyInput({...modifyInput, amount: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', color: 'var(--text)', backgroundColor: 'var(--bg)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Notes</label>
              <textarea placeholder="Add notes..." value={modifyInput.notes} onChange={(e) => setModifyInput({...modifyInput, notes: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', color: 'var(--text)', backgroundColor: 'var(--bg)', outline: 'none', minHeight: '80px', resize: 'none', boxSizing: 'border-box' }} />
            </div>
            <button onClick={handleSaveModification} style={{ width: '100%', padding: '14px 24px', backgroundColor: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '24px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}>Save Changes</button>
          </div>
        </div>
      )}

      {showSavePrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: '24px', padding: '32px 24px', maxWidth: '480px', width: 'calc(100% - 40px)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', textAlign: 'center', marginTop: 0 }}>Perfect! You finished this recipe!</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-light)', textAlign: 'center', marginBottom: '32px' }}>Do you want to save this recipe to "My Recipe Book"?</p>
            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
              <button 
                onClick={() => {
                  // Do NOT clear progress here. We want to be able to navigate back exactly.
                  addRecent({ id: 'authentic-lebanese-chicken', name: 'Authentic Lebanese Chicken with Rice', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', time: '40 mins', portions: '2 portions' });
                  setShowSavePrompt(false);
                  navigate('/save-recipe', { state: { modifications: modificationsRef.current } });
                }} 
                style={{ width: '100%', padding: '16px 24px', backgroundColor: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '24px', fontWeight: '600', fontSize: '16px' }}
              >Yes, I want</button>
              <button onClick={() => { clearProgress(recipeId); setShowSavePrompt(false); navigate('/'); }} style={{ width: '100%', padding: '16px 24px', backgroundColor: 'white', color: 'var(--text)', border: '1.5px solid var(--text)', borderRadius: '24px', fontWeight: '600', fontSize: '16px' }}>No, I don't</button>
            </div>
          </div>
        </div>
      )}

      <DeboningModal 
        isOpen={isDeboneModalOpen} 
        onClose={() => setIsDeboneModalOpen(false)} 
      />
    </div>
  );
};

export default LiveCooking;
