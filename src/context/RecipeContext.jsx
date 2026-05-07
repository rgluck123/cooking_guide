import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialRecipes } from '../data/recipes';

const RecipeContext = createContext();

const getStoredJson = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const defaultRecentRecipes = [
  { id: 'authentic-lebanese-chicken', name: 'Authentic Lebanese Chicken with Rice', time: '40 mins', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'White Bean Basil Chicken Chili', time: '70 mins', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Veggie & Rice Stir-Fry', time: '65 mins', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Beef Tacos', time: '30 mins', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80' },
  { id: '5', name: 'Mushroom Risotto', time: '45 mins', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=300&q=80' }
];

export const RecipeProvider = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState(() => getStoredJson('savedRecipes', []));
  const [recentRecipes, setRecentRecipes] = useState(() => {
    const stored = getStoredJson('recentRecipes', null);
    if (!stored || stored.length < 5) return defaultRecentRecipes;
    return stored;
  });
  const [recipeProgress, setRecipeProgress] = useState(() => getStoredJson('recipeProgress', {}));
  const [liveCookingDefaults, setLiveCookingDefaults] = useState(() => getStoredJson('liveCookingDefaults', {
    voiceOverEnabled: true,
    micEnabled: true
  }));

  const [activeRecipe, setActiveRecipe] = useState(null);

  const [testingMode, setTestingMode] = useState(true);

  // Load recipes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('savedRecipes');
    if (stored) {
      setSavedRecipes(JSON.parse(stored));
    }
    const recentStored = localStorage.getItem('recentRecipes');
    if (recentStored) {
      setRecentRecipes(JSON.parse(recentStored));
    }
    const progressStored = localStorage.getItem('recipeProgress');
    if (progressStored) {
      setRecipeProgress(JSON.parse(progressStored));
    }
    const activeStored = localStorage.getItem('activeRecipe');
    if (activeStored) {
      setActiveRecipe(JSON.parse(activeStored));
    }
    const testingStored = localStorage.getItem('testingMode');
    if (testingStored !== null) {
      setTestingMode(JSON.parse(testingStored));
    }
  }, []);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    localStorage.setItem('recentRecipes', JSON.stringify(recentRecipes));
  }, [recentRecipes]);

  useEffect(() => {
    localStorage.setItem('recipeProgress', JSON.stringify(recipeProgress));
  }, [recipeProgress]);

  useEffect(() => {
    localStorage.setItem('liveCookingDefaults', JSON.stringify(liveCookingDefaults));
  }, [liveCookingDefaults]);

  useEffect(() => {
    if (activeRecipe) {
      localStorage.setItem('activeRecipe', JSON.stringify(activeRecipe));
    }
  }, [activeRecipe]);

  useEffect(() => {
    localStorage.setItem('testingMode', JSON.stringify(testingMode));
  }, [testingMode]);

  const setActiveRecipeById = (recipeId, forceReset = false) => {
    // Mapping for old IDs to prevent blank pages on mobile with cached data
    const idMapping = {
      'lebanese-spicy-chicken': 'authentic-lebanese-chicken'
    };
    const effectiveId = idMapping[recipeId] || recipeId;

    // If not forcing a reset and already have the right recipe, skip update
    if (!forceReset && activeRecipe && activeRecipe.id === effectiveId) {
      return;
    }

    // 1. Try initial recipes
    let recipe = initialRecipes[effectiveId];
    
    // 2. Try saved recipes if not found
    if (!recipe) {
      recipe = savedRecipes.find(r => r.id.toString() === effectiveId.toString());
    }

    if (recipe) {
      setActiveRecipe(JSON.parse(JSON.stringify(recipe))); // Deep clone
    }
  };

  const forkIfBase = (recipe) => {
    if (!recipe) return null;
    if (recipe.id === 'authentic-lebanese-chicken' || recipe.id === recipe.baseRecipeId) {
      return { ...recipe, id: `instance-${Date.now()}`, baseRecipeId: recipe.id || 'authentic-lebanese-chicken', isModified: true };
    }
    return { ...recipe, isModified: true };
  };

  const updateActiveRecipeIngredients = (newIngredients) => {
    setActiveRecipe(prev => prev ? { ...forkIfBase(prev), ingredients: newIngredients } : null);
  };

  const addActiveRecipeIngredient = (ingredient) => {
    setActiveRecipe(prev => prev ? { 
      ...forkIfBase(prev), 
      ingredients: [...prev.ingredients, ingredient] 
    } : null);
  };

  const updateActiveRecipe = (updates) => {
    setActiveRecipe(prev => prev ? { ...prev, ...updates } : null);
  };

  const scaleActiveRecipePortions = (newPortions) => {
    setActiveRecipe(prev => {
      if (!prev) return null;
      const forked = forkIfBase(prev);
      const scaledIngredients = forked.ingredients.map(ing => {
        if (ing.baseQuantity === 0 || isNaN(Number(ing.baseQuantity))) return ing;
        const newQty = (ing.baseQuantity * newPortions);
        // Format nicely: remove .0, keep 1 decimal if needed
        const formattedQty = parseFloat(Number(newQty).toFixed(1)).toString();
        return { ...ing, quantity: `${formattedQty}${ing.unit ? (ing.unit.length > 1 ? ' ' + ing.unit : ing.unit) : ''}` };
      });
      return { 
        ...forked, 
        portions: `${newPortions} Portions`,
        ingredients: scaledIngredients 
      };
    });
  };

  const saveRecipe = (recipe, forceNewId = false) => {
    const recipeIdToSave = forceNewId ? `instance-${Date.now()}` : (recipe.id || `instance-${Date.now()}`);
    const newRecipe = {
      ...recipe,
      id: recipeIdToSave,
      timestamp: new Date().toISOString(),
    };
    
    setSavedRecipes(prev => {
      const filtered = prev.filter(r => r.id !== recipeIdToSave);
      return [newRecipe, ...filtered];
    });
    return recipeIdToSave;
  };

  const addRecent = (recipe) => {
    setRecentRecipes(prev => {
      const filtered = prev.filter(r => r.id !== recipe.id);
      return [recipe, ...filtered].slice(0, 10); // Keep last 10 recents
    });
  };

  const deleteRecent = (recipeId) => {
    setRecentRecipes(prev => {
      const updated = prev.filter(r => r.id !== recipeId);
      localStorage.setItem('recentRecipes', JSON.stringify(updated));
      return updated;
    });
  };

  const updateProgress = (recipeId, stepIndex, totalSteps) => {
    setRecipeProgress(prev => ({
      ...prev,
      [recipeId]: {
        currentStep: stepIndex,
        totalSteps: totalSteps,
        timestamp: new Date().toISOString()
      }
    }));
  };

  const clearProgress = (recipeId) => {
    setRecipeProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[recipeId];
      return newProgress;
    });
  };

  const updateLiveCookingDefaults = (updates) => {
    setLiveCookingDefaults(prev => ({ ...prev, ...updates }));
  };

  const deleteRecipe = (recipeId) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== recipeId));
  };

  const getRecipeById = (recipeId) => {
    return savedRecipes.find(r => r.id === recipeId);
  };

  return (
    <RecipeContext.Provider value={{ 
      savedRecipes, 
      recentRecipes,
      recipeProgress,
      liveCookingDefaults,
      activeRecipe,
      testingMode,
      setTestingMode,
      setActiveRecipeById,
      updateActiveRecipeIngredients,
      addActiveRecipeIngredient,
      updateActiveRecipe,
      scaleActiveRecipePortions,
      saveRecipe, 
      addRecent,
      deleteRecent,
      updateProgress,
      clearProgress,
      updateLiveCookingDefaults,
      deleteRecipe, 
      getRecipeById 
    }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within RecipeProvider');
  }
  return context;
};
