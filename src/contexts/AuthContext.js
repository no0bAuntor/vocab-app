import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('vocab_token');
        if (token) {
          // Verify token with backend
          const response = await apiService.verifyToken(token);
          if (response.success && response.valid) {
            setUser(response.user);
            setIsAuthenticated(true);
          } else {
            // Invalid token, clear it
            localStorage.removeItem('vocab_token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('vocab_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Register new user
  const register = async (username, password, email = '') => {
    try {
      setIsLoading(true);
      const response = await apiService.register(username, password, email);
      
      if (response.success) {
        // Store JWT token
        localStorage.setItem('vocab_token', response.token);
        
        // Set user state
        setUser(response.user);
        setIsAuthenticated(true);
        
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Login existing user
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(username, password);
      
      if (response.success) {
        // Store JWT token
        localStorage.setItem('vocab_token', response.token);
        
        // Set user state
        setUser(response.user);
        setIsAuthenticated(true);
        
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Call backend logout (for token blacklisting if implemented)
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of backend response
      localStorage.removeItem('vocab_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Update user progress
  const updateProgress = async (phase, score, totalQuestions = 50) => {
    if (!user) return null;

    try {
      const response = await apiService.updateQuizProgress(phase, score);
      
      if (response.success) {
        // Update local user state with new progress
        const updatedUser = { ...user };
        updatedUser.progress.phaseScores[`phase${phase}`] = Math.max(
          updatedUser.progress.phaseScores[`phase${phase}`] || 0, 
          score
        );
        updatedUser.progress.unlockedPhases = response.data.unlockedPhases;
        updatedUser.profile.totalXP = response.data.totalXP;
        updatedUser.profile.level = response.data.level;

        setUser(updatedUser);

        return {
          ...response.data,
          user: updatedUser
        };
      } else {
        console.error('Failed to update progress:', response.error);
        return null;
      }
    } catch (error) {
      console.error('Update progress error:', error);
      return null;
    }
  };

  // Check if phase is unlocked
  const isPhaseUnlocked = (phase) => {
    if (!user) return phase === 1; // Phase 1 is always unlocked
    return user.progress.unlockedPhases.includes(phase);
  };

  // Get phase progress (adapted to new schema)
  const getPhaseProgress = (phase) => {
    if (!user) return null;
    const phaseKey = `phase${phase}`;
    const bestScore = user.progress.phaseScores[phaseKey] || 0;
    return {
      unlocked: isPhaseUnlocked(phase),
      bestScore,
      attempts: bestScore > 0 ? 1 : 0 // Simplified - backend can track this if needed
    };
  };

  // Refresh user data from backend
  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // Add achievement
  const addAchievement = async (achievementId, name, description, icon = '🏆') => {
    try {
      const response = await apiService.addAchievement(achievementId, name, description, icon);
      if (response.success) {
        // Refresh user data to get updated achievements
        await refreshUser();
        return response;
      }
    } catch (error) {
      console.error('Add achievement error:', error);
    }
    return null;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProgress,
    isPhaseUnlocked,
    getPhaseProgress,
    refreshUser,
    addAchievement
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };