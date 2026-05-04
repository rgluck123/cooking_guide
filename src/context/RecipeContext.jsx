import React, { createContext, useContext, useState, useEffect } from 'react';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Load recipes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('savedRecipes');
    if (stored) {
      setSavedRecipes(JSON.parse(stored));
    }
  }, []);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const saveRecipe = (recipe) => {
    const newRecipe = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...recipe
    };
    setSavedRecipes(prev => [newRecipe, ...prev]);
    return newRecipe.id;
  };

  const deleteRecipe = (recipeId) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== recipeId));
  };

  const getRecipeById = (recipeId) => {
    return savedRecipes.find(r => r.id === recipeId);
  };

  return (
    <RecipeContext.Provider value={{ savedRecipes, saveRecipe, deleteRecipe, getRecipeById }}>
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
