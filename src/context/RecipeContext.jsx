import React, { createContext, useContext, useState, useEffect } from 'react';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);

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
  }, []);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    localStorage.setItem('recentRecipes', JSON.stringify(recentRecipes));
  }, [recentRecipes]);

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
      saveRecipe, 
      addRecent,
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
