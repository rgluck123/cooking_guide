import React, { createContext, useContext, useState, useEffect } from 'react';

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
  { id: 'lebanese-spicy-chicken', name: 'Authentic Lebanese Chicken with Rice', time: '40 mins', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'White Bean Basil Chicken Chili', time: '70 mins', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Veggie & Rice Stir-Fry', time: '65 mins', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Beef Tacos', time: '30 mins', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80' }
];

export const RecipeProvider = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState(() => getStoredJson('savedRecipes', []));
  const [recentRecipes, setRecentRecipes] = useState(() => {
    const stored = getStoredJson('recentRecipes', null);
    if (!stored || stored.length < 4) return defaultRecentRecipes;
    return stored;
  });
  const [recipeProgress, setRecipeProgress] = useState(() => getStoredJson('recipeProgress', {}));
  const [liveCookingDefaults, setLiveCookingDefaults] = useState(() => getStoredJson('liveCookingDefaults', {
    voiceOverEnabled: true,
    micEnabled: true
  }));

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

  const saveRecipe = (recipe) => {
    const newRecipe = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...recipe
    };
    setSavedRecipes(prev => [newRecipe, ...prev]);
    return newRecipe.id;
  };

  const addRecent = (recipe) => {
    setRecentRecipes(prev => {
      const filtered = prev.filter(r => r.id !== recipe.id);
      return [recipe, ...filtered].slice(0, 10); // Keep last 10 recents
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
      saveRecipe, 
      addRecent,
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
