import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Play, Bookmark, Info } from 'lucide-react';
import InteractiveIngredient from '../components/InteractiveIngredient';
import SubstituteModal from '../components/SubstituteModal';
import DeboningModal from '../components/DeboningModal';

const initialIngredients = [
  { id: 1, name: 'Chicken Breast', quantity: '500g', originalName: 'Chicken Breast', edited: false },
  { id: 2, name: 'Olive Oil', quantity: '2 tbsp', originalName: 'Olive Oil', edited: false },
  { id: 3, name: 'Garlic', quantity: '3 cloves', originalName: 'Garlic', edited: false },
  { id: 4, name: 'Lebanese Spice Mix', quantity: '1 tbsp', originalName: 'Lebanese Spice Mix', edited: false },
  { id: 5, name: 'Lemon Juice', quantity: '2 tbsp', originalName: 'Lemon Juice', edited: false },
];

const cookingSteps = [
  { id: 1, title: 'Cook the rice', instruction: 'Rinse 190g white rice and add to a pot with 380ml water. Bring to a boil, then reduce heat and simmer covered for 18-20 minutes until tender.' },
  { id: 2, title: 'Debone the chicken', instruction: 'Let the cooked chicken cool for a few minutes. Carefully remove all bones and skin, shredding the meat into bite-sized pieces.' },
  { id: 3, title: 'Cut the onion', instruction: 'Peel 1 yellow onion and cut it into thin slices. Try to keep them roughly the same thickness for even cooking.' },
  { id: 4, title: 'Heat oil in the pan', instruction: 'Heat oil in a large pan over medium heat and add the chopped onion. Sauté for 2-3 minutes until translucent and fragrant.' },
  { id: 5, title: 'Add your seasoning', instruction: 'Add a pinch of salt, pepper, and a teaspoon each of cumin, coriander, and cinnamon. Stir well to combine.' },
  { id: 6, title: 'Stir for 1 minute', instruction: 'Keep stirring the spices with the onions to toast them and release their aroma.' },
  { id: 7, title: 'Push the chicken thighs in the pan', instruction: 'Carefully add the shredded chicken pieces to the pan and mix well with the spiced onions.' },
  { id: 8, title: 'Cook for about 8 minutes on each side until they look golden brown and juicy', instruction: 'Allow the chicken to cook through and develop a nice golden color on all sides.' },
  { id: 9, title: 'Squeeze half a lemon over the chicken to brighten up the ingredients', instruction: 'Drizzle fresh lemon juice over the cooked chicken for added zest and flavor.' },
  { id: 10, title: 'Cut the other half of the lemon in slices', instruction: 'Slice the remaining lemon half into thin slices for serving.' },
  { id: 11, title: 'Drain the water from the rice', instruction: 'Separate the rice grains and prepare for serving.' }
];

const RecipeOverview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ingredients, setIngredients] = useState(initialIngredients);
  
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeSubIngredient, setActiveSubIngredient] = useState(null);
  
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [activeActionIngredient, setActiveActionIngredient] = useState(null);

  const [isDeboneModalOpen, setIsDeboneModalOpen] = useState(false);

  const handleDelete = (item) => {
    setIngredients(prev => prev.filter(i => i.id !== item.id));
    setIsActionMenuOpen(false);
  };

  const openSubstitute = (item) => {
    setActiveSubIngredient(item);
    setIsSubModalOpen(true);
    setIsActionMenuOpen(false);
  };

  const handleLongPress = (item) => {
    setActiveActionIngredient(item);
    setIsActionMenuOpen(true);
  };

  const handleSubstitute = (id, newName, newQty) => {
    setIngredients(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, name: newName, quantity: newQty, edited: true };
      }
      return item;
    }));
  };

  return (
    <div style={{ paddingBottom: 'calc(100px + env(safe-area-inset-bottom))', backgroundColor: 'var(--bg)', minHeight: '100vh', position: 'relative' }}>
      
      {/* Top Image & Header */}
      <div style={{ position: 'relative', height: '300px' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
          background: 'linear-gradient(rgba(0,0,0,0.5), transparent)'
        }} />
        <button 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', top: 'calc(24px + env(safe-area-inset-top))', left: '20px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', border: 'none', padding: '8px', cursor: 'pointer' }}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          style={{ position: 'absolute', top: 'calc(24px + env(safe-area-inset-top))', right: '20px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', border: 'none', padding: '8px', cursor: 'pointer' }}
        >
          <Bookmark size={24} color="var(--accent-green)" />
        </button>
      </div>

      {/* Recipe Info */}
      <div style={{
        marginTop: '-30px',
        position: 'relative',
        backgroundColor: 'var(--bg)',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        padding: '32px 24px'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>Lebanese Spicy Chicken</h1>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', padding: '6px 12px', borderRadius: '16px', fontWeight: '700', fontSize: '14px' }}>45 min</div>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '16px', fontWeight: '600', fontSize: '14px' }}>Intermediate</div>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '16px', fontWeight: '600', fontSize: '14px' }}>4 Portions</div>
        </div>

        {/* Ingredients */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Ingredients</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '24px' }}>
            Swipe right to substitute, left to delete, or long press for options.
          </p>
          
          <div>
            {ingredients.map(item => (
              <InteractiveIngredient 
                key={item.id} 
                item={item} 
                onSwipeLeft={handleDelete}
                onSwipeRight={openSubstitute}
                onLongPress={handleLongPress}
              />
            ))}
          </div>
        </div>

        {/* Steps Overview */}
        <div style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', margin: 0 }}>Steps</h2>
            <button style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--text)', cursor: 'pointer' }}>Edit</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cookingSteps.map((step) => (
              <div key={step.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent-green)', minWidth: '24px', lineHeight: '1.5' }}>
                    {step.id}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0', fontSize: '15px', fontWeight: '600', color: 'var(--text)', lineHeight: '1.4' }}>
                      {step.title}
                    </p>
                    <div style={{ borderBottom: '1px dotted var(--border)', marginTop: '8px' }} />
                  </div>
                </div>
                {step.id === 2 && (
                  <button
                    onClick={() => setIsDeboneModalOpen(true)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--accent-green-light)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--accent-green)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      marginLeft: '12px'
                    }}
                  >
                    More info
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Floating Action */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '432px',
        zIndex: 50
      }}>
        <button 
          onClick={() => navigate('/live-cooking')}
          style={{
            width: '100%',
            backgroundColor: 'var(--accent-green)',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            padding: '20px',
            fontSize: '18px',
            fontWeight: '800',
            fontFamily: 'var(--heading)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 10px 20px rgba(74, 107, 68, 0.3)',
            cursor: 'pointer'
          }}
        >
          <Play size={24} fill="currentColor" />
          Start Cooking
        </button>
      </div>

      {/* Modals */}
      <SubstituteModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
        ingredient={activeSubIngredient} 
        onSubstitute={handleSubstitute}
      />

      <DeboningModal 
        isOpen={isDeboneModalOpen}
        onClose={() => setIsDeboneModalOpen(false)}
      />

      {/* Long Press Action Menu Overlay */}
      {isActionMenuOpen && activeActionIngredient && (
        <div 
          onClick={() => setIsActionMenuOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            maxWidth: '480px', margin: '0 auto'
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '24px', textAlign: 'center' }}>{activeActionIngredient.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => openSubstitute(activeActionIngredient)}
                style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', fontWeight: '700', border: 'none', fontSize: '16px' }}
              >
                Substitute Ingredient
              </button>
              <button 
                onClick={() => handleDelete(activeActionIngredient)}
                style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: '700', border: 'none', fontSize: '16px' }}
              >
                Delete Ingredient
              </button>
              <button 
                onClick={() => setIsActionMenuOpen(false)}
                style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: '600', fontSize: '16px', marginTop: '8px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecipeOverview;