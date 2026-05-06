import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

const RecipeBook = () => {
  const navigate = useNavigate();
  const { savedRecipes, deleteRecipe } = useRecipes();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteRecipe = (recipeId) => {
    deleteRecipe(recipeId);
    setDeleteConfirm(null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <header style={{
        padding: 'calc(24px + env(safe-area-inset-top)) 20px 12px',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <button
          onClick={() => navigate('/')}
          aria-label="Back to home"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            marginLeft: '-8px',
            marginRight: '8px',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <ChevronLeft size={28} />
        </button>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--text)',
          margin: 0,
          fontFamily: 'var(--heading)'
        }}>
          Recipe Book
        </h1>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {savedRecipes.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            marginTop: '80px'
          }}>
            <p style={{
              fontSize: '16px',
              color: 'var(--text)',
              fontWeight: '700',
              margin: '0 0 10px 0'
            }}>
              No saved recipes yet
            </p>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-light)',
              lineHeight: '1.6',
              margin: 0,
              maxWidth: '260px'
            }}>
              Cook and save a recipe to see it here!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  display: 'flex',
                  height: '120px'
                }}
              >
                {/* Recipe Image */}
                <div style={{
                  width: '100px',
                  height: '100%',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Recipe Info */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '12px 16px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'var(--text)',
                      margin: '0 0 4px 0'
                    }}>
                      {recipe.name}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-light)',
                      margin: '0'
                    }}>
                      ⏱️ {recipe.time} • 👥 {recipe.portions}
                    </p>
                  </div>
                  {recipe.modifications && recipe.modifications.length > 0 && (
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--accent-green)',
                      margin: '0'
                    }}>
                      {recipe.modifications.length} modification{recipe.modifications.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => setDeleteConfirm(recipe.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-light)',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-orange)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-light)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            padding: '32px 24px',
            maxWidth: '480px',
            width: 'calc(100% - 40px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--text)',
              marginTop: 0,
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              Delete Recipe?
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-light)',
              lineHeight: '1.6',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
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
                Keep Recipe
              </button>
              <button
                onClick={() => handleDeleteRecipe(deleteConfirm)}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  backgroundColor: 'var(--accent-orange)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '24px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeBook;
