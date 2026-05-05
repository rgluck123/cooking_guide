import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronLeft, Pencil } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import CookingTimer from '../components/CookingTimer';

const cookingSteps = [
  {
    id: 1,
    title: "Cook the rice",
    instruction: "Rinse 190g white rice and add to a pot with 380ml water. Bring to a boil, then reduce heat and simmer covered for 18-20 minutes until tender.",
    image: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=400&q=80",
    hasTimer: true,
    timerSeconds: 1200 // 20 mins
  },
  {
    id: 2,
    title: "Debone the chicken",
    instruction: "Let the cooked chicken cool for a few minutes. Carefully remove all bones and skin, shredding the meat into bite-sized pieces.",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&q=80",
    hasTimer: false
  },
  {
    id: 3,
    title: "Cut the onion",
    instruction: "Peel 1 yellow onion and cut it into thin slices. Try to keep them roughly the same thickness for even cooking.",
    image: "https://images.unsplash.com/photo-1608270861620-7d5e8c75c5e5?auto=format&fit=crop&w=400&q=80",
    hasTimer: false
  },
  {
    id: 4,
    title: "Heat oil in the pan",
    instruction: "Heat oil in a large pan over medium heat and add the chopped onion. Sauté for 2-3 minutes until translucent and fragrant.",
    image: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=400&q=80",
    hasTimer: true,
    timerSeconds: 180 // 3 mins
  },
  {
    id: 5,
    title: "Add your seasoning",
    instruction: "Add a pinch of salt, pepper, and a teaspoon each of cumin, coriander, and cinnamon. Stir well to combine.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    hasTimer: false
  },
  {
    id: 6,
    title: "Stir for 1 minute",
    instruction: "Keep stirring the spices with the onions to toast them and release their aroma.",
    image: "https://images.unsplash.com/photo-1577615771461-98d5d10fbc1e?auto=format&fit=crop&w=400&q=80",
    hasTimer: true,
    timerSeconds: 60 // 1 min
  },
  {
    id: 7,
    title: "Add the chicken",
    instruction: "Push the onions to the side and place your shredded chicken in the pan. Stir to combine.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    hasTimer: false
  },
  {
    id: 8,
    title: "Cook the chicken",
    instruction: "Cook for about 5-8 minutes until the chicken is heated through and starts to brown slightly at the edges.",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80",
    hasTimer: true,
    timerSeconds: 480 // 8 mins
  },
  {
    id: 9,
    title: "Add lemon",
    instruction: "Squeeze half a lemon over the chicken and gently mix. This brightens the flavors beautifully.",
    image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7b?auto=format&fit=crop&w=400&q=80",
    hasTimer: false
  },
  {
    id: 10,
    title: "Drain the rice",
    instruction: "Once the rice is cooked, drain any excess water carefully using a colander.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
    hasTimer: false
  },
  {
    id: 11,
    title: "Plate and serve",
    instruction: "Divide the rice between plates and top with the chicken mixture. Serve hot with lemon slices on the side.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    hasTimer: false
  }
];

const LiveCooking = () => {
  const navigate = useNavigate();
  const { addRecent } = useRecipes();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [modifications, setModifications] = useState([]);
  const [modifyInput, setModifyInput] = useState({ name: '', amount: '', notes: '' });
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);
  const loopTimeoutRef = useRef(null);

  const step = cookingSteps[currentStepIndex] || cookingSteps[0];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === cookingSteps.length - 1;
  const progressPercent = ((currentStepIndex + 1) / cookingSteps.length) * 100;

  const nextStep = () => {
    if (isLastStep) {
      setShowSavePrompt(true);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  const prevStep = () => !isFirstStep && setCurrentStepIndex(prev => prev - 1);

  // Voice interaction setup - auto-listening in cooking mode
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    // Check if Safari (doesn't support webkitSpeechRecognition reliably)
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
      // Loop: restart listening after 500ms
      if (voiceEnabled) {
        loopTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && voiceEnabled) {
            recognitionRef.current.start();
          }
        }, 500);
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      
      if (transcript.includes('next')) {
        nextStep();
      } else if (transcript.includes('previous') || transcript.includes('prev')) {
        prevStep();
      } else if (transcript.includes('back')) {
        navigate('/');
      }
    };

    recognitionRef.current = recognition;

    // Auto-start on mount
    setVoiceEnabled(true);
    recognition.start();

    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
      recognition.abort();
    };
  }, []);

  // Speak step instructions when step changes
  useEffect(() => {
    if (!voiceSupported) return;

    const utterance = new SpeechSynthesisUtterance(`${step.title}. ${step.instruction}`);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [currentStepIndex, voiceSupported]);

  const toggleVoice = () => {
    // Removed - voice always on in cooking mode
  };

  // Swipe handling
  let touchStartX = 0;
  const handleTouchStart = (e) => touchStartX = e.touches[0].clientX;
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    if (diffX > 50) nextStep(); // Swipe Left (go forward)
    if (diffX < -50) prevStep(); // Swipe Right (go back)
  };

  return (
    <div 
      style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column', paddingBottom: 'env(safe-area-inset-bottom)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(24px + env(safe-area-inset-top)) 20px 12px', zIndex: 10 }}>
        <button onClick={() => navigate('/')} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '50%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow)' }}>
          <Home size={24} color="var(--text)" />
        </button>
        <button onClick={() => navigate(-1)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: 'var(--shadow)' }}>
          <ChevronLeft size={20} color="var(--text)" />
          <span style={{ fontWeight: '700', fontSize: '14px' }}>Recipe Overview</span>
        </button>
      </header>

      <div style={{ padding: '0 20px 10px' }}>
        <div style={{ height: '8px', borderRadius: '999px', backgroundColor: 'var(--accent-green-light)', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', borderRadius: '999px', backgroundColor: 'var(--accent-green)' }} />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px 20px' }}>
        {/* Step Title - Centered (slightly lower for central visual) */}
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '28px', fontWeight: '700', color: 'var(--text)', marginTop: '32px', marginBottom: '8px', lineHeight: 1.3, textAlign: 'center' }}>
          {step.title}
        </h2>

        {/* Step Instructions - Centered */}
        <p style={{ fontSize: '15px', color: 'var(--text-light)', lineHeight: '1.8', marginTop: '6px', marginBottom: '20px', textAlign: 'center' }}>
          {step.instruction}
        </p>

        {/* Step Image - Large, beautiful (skip for steps 1, 2, 5, 7, 9) */}
        {![1, 2, 5, 7, 9].includes(step.id) && (
          <div style={{ width: '100%', height: '280px', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}>
            <img 
              src={step.image} 
              alt={step.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Flex spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Controls row: Modify (always) and More (for debone) placed ABOVE the timer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
          {step.id === 2 && (
            <button
              onClick={() => setIsMoreOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '999px',
                backgroundColor: 'white',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              More
            </button>
          )}

          <button
            onClick={() => setIsModifyModalOpen(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 20px', 
              borderRadius: '999px', 
              backgroundColor: 'var(--accent-green-light)', 
              border: '1.5px solid var(--accent-green)', 
              color: 'var(--accent-green)', 
              fontWeight: '600', 
              fontSize: '13px', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-green)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-green-light)'; e.currentTarget.style.color = 'var(--accent-green)'; }}
          >
            <Pencil size={16} />
            Modify
          </button>
        </div>

        {/* Timer - centered below controls */}
        {step.hasTimer && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
            <CookingTimer durationInSeconds={step.timerSeconds} />
          </div>
        )}

        {/* Previous/Next Navigation - Bottom */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={prevStep}
            disabled={isFirstStep}
            style={{ flex: 1, minHeight: '48px', borderRadius: '999px', backgroundColor: 'white', color: 'var(--text)', border: '1.5px solid var(--text)', fontWeight: '600', fontSize: '14px', cursor: isFirstStep ? 'not-allowed' : 'pointer', opacity: isFirstStep ? 0.4 : 1 }}
          >
            ← Previous
          </button>
          <button 
            onClick={nextStep}
            style={{ flex: 1, minHeight: '48px', borderRadius: '999px', backgroundColor: 'var(--text)', color: 'white', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
          >
            {isLastStep ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>

      {/* Modify Modal - Bottom Sheet from Figma Design */}
      {isModifyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: '25px', padding: '20px', maxWidth: '480px', width: 'calc(100% - 40px)', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0px -4px 13.1px rgba(0, 0, 0, 0.1)', border: '1px solid #1b1b1b' }}>
            
            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', margin: 0, fontFamily: 'var(--heading)' }}>Modify Ingredient</h2>
              <button onClick={() => setIsModifyModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text)', padding: '0', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
                ✕
              </button>
            </div>

            {/* Ingredient Name Field */}
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', textTransform: 'capitalize', fontFamily: 'var(--sans)' }}>Ingredient name</label>
              <input 
                type="text" 
                placeholder="e.g., chili pepper"
                value={modifyInput.name}
                onChange={(e) => setModifyInput({...modifyInput, name: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  fontSize: '14px', 
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg)',
                  fontFamily: 'var(--sans)',
                  boxSizing: 'border-box',
                  outline: 'none'
                }} 
              />
            </div>

            {/* Amount Field */}
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', textTransform: 'capitalize', fontFamily: 'var(--sans)' }}>Amount</label>
              <input 
                type="text" 
                placeholder="e.g., 1 tablespoon"
                value={modifyInput.amount}
                onChange={(e) => setModifyInput({...modifyInput, amount: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  fontSize: '14px', 
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg)',
                  fontFamily: 'var(--sans)',
                  boxSizing: 'border-box',
                  outline: 'none'
                }} 
              />
            </div>

            {/* Notes Field */}
            <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', textTransform: 'capitalize', fontFamily: 'var(--sans)' }}>Notes</label>
              <textarea 
                placeholder="Add any cooking notes or substitutions..."
                value={modifyInput.notes}
                onChange={(e) => setModifyInput({...modifyInput, notes: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  fontSize: '14px', 
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg)',
                  fontFamily: 'var(--sans)',
                  boxSizing: 'border-box',
                  outline: 'none',
                  minHeight: '80px',
                  resize: 'none'
                }} 
              />
            </div>

            {/* Save Modification Button */}
            <button 
              onClick={() => {
                if (modifyInput.name || modifyInput.amount || modifyInput.notes) {
                  setModifications([...modifications, { id: Date.now(), ...modifyInput }]);
                  setModifyInput({ name: '', amount: '', notes: '' });
                }
                setIsModifyModalOpen(false);
              }}
              style={{ 
                width: '100%', 
                padding: '14px 24px', 
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
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Finish & Save Prompt Modal */}
      {showSavePrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: '24px', padding: '32px 24px', maxWidth: '480px', width: 'calc(100% - 40px)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', marginTop: 0, marginBottom: '12px', textAlign: 'center' }}>Perfect! You finished this recipe!</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '32px', textAlign: 'center' }}>Do you want to save this recipe to "My Recipe"?</p>
            
            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
              <button 
                onClick={() => {
                  // Add to recents when opening save screen
                  addRecent({
                    id: 'lebanese-spicy-chicken',
                    name: 'Lebanese Spicy Chicken',
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
                    time: '40 mins',
                    portions: '2 portions'
                  });
                  setShowSavePrompt(false);
                  navigate('/save-recipe', { state: { modifications } });
                }}
                style={{ 
                  width: '100%', 
                  padding: '16px 24px', 
                  backgroundColor: 'var(--accent-green)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '24px', 
                  fontWeight: '600', 
                  fontSize: '16px', 
                  cursor: 'pointer'
                }}
              >
                Yes, I want
              </button>
              <button 
                onClick={() => {
                  setShowSavePrompt(false);
                  navigate('/');
                }}
                style={{ 
                  width: '100%', 
                  padding: '16px 24px', 
                  backgroundColor: 'white', 
                  color: 'var(--text)', 
                  border: '1.5px solid var(--text)', 
                  borderRadius: '24px', 
                  fontWeight: '600', 
                  fontSize: '16px', 
                  cursor: 'pointer'
                }}
              >
                No, I don't
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Info Modal for Deboning (step 2) */}
      {isMoreOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: '24px', padding: '24px', maxWidth: '100%', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: 'var(--text)', textAlign: 'left' }}>Tips for Deboning</h2>
            <ol style={{ textAlign: 'left', color: 'var(--text-light)', marginBottom: '24px', paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>Let the chicken rest until cool enough to handle.</li>
              <li>Use clean kitchen shears or a sharp knife to remove large bones first.</li>
              <li>Work slowly to feel for small bones and remove them with tweezers if needed.</li>
              <li>Pull the meat apart with two forks to shred evenly.</li>
            </ol>
            <button onClick={() => setIsMoreOpen(false)} style={{ padding: '14px 16px', width: '100%', backgroundColor: 'var(--accent-green)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LiveCooking;