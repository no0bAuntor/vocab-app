const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Save quiz session progress
router.post('/save-session', auth, [
  body('phase')
    .isInt({ min: 1, max: 5 })
    .withMessage('Phase must be between 1 and 5'),
  body('currentQuestionIndex')
    .isInt({ min: 0 })
    .withMessage('Current question index must be a non-negative integer'),
  body('sessionScore')
    .isInt({ min: 0 })
    .withMessage('Session score must be a non-negative integer'),
  body('sessionAnswers')
    .isArray()
    .withMessage('Session answers must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages: errors.array().map(err => err.msg)
      });
    }

    const { phase, currentQuestionIndex, sessionScore, sessionAnswers } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if phase is unlocked
    if (!user.isPhaseUnlocked(phase)) {
      return res.status(403).json({
        success: false,
        error: 'Phase not unlocked'
      });
    }

    // Save quiz session
    user.saveQuizSession(phase, currentQuestionIndex, sessionScore, sessionAnswers);
    await user.save();

    res.json({
      success: true,
      message: 'Quiz session saved successfully',
      data: {
        phase,
        currentQuestionIndex,
        sessionScore,
        sessionAnswers: sessionAnswers.length
      }
    });

  } catch (error) {
    console.error('Save quiz session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save quiz session'
    });
  }
});

// Load quiz session
router.get('/load-session/:phase', auth, async (req, res) => {
  try {
    const phase = parseInt(req.params.phase);
    
    // Validate phase
    if (isNaN(phase) || phase < 1 || phase > 5) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phase number'
      });
    }

    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if phase is unlocked
    if (!user.isPhaseUnlocked(phase)) {
      return res.status(403).json({
        success: false,
        error: 'Phase not unlocked'
      });
    }

    // Get quiz session
    const session = user.getQuizSession(phase);

    res.json({
      success: true,
      data: {
        phase,
        session
      }
    });

  } catch (error) {
    console.error('Load quiz session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load quiz session'
    });
  }
});

// Complete quiz session
router.post('/complete-session', auth, [
  body('phase')
    .isInt({ min: 1, max: 5 })
    .withMessage('Phase must be between 1 and 5'),
  body('finalScore')
    .isInt({ min: 0 })
    .withMessage('Final score must be a non-negative integer'),
  body('questionsTotal')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Questions total must be a positive integer')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages: errors.array().map(err => err.msg)
      });
    }

    const { phase, finalScore, questionsTotal = 50 } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if phase is unlocked
    if (!user.isPhaseUnlocked(phase)) {
      return res.status(403).json({
        success: false,
        error: 'Phase not unlocked'
      });
    }

    // Complete quiz session (this also updates phase score and unlocks next phase if needed)
    const previousPhaseScore = user.progress.phaseScores[`phase${phase}`];
    const newPhaseUnlocked = finalScore >= 45 && phase < 5 && !user.progress.unlockedPhases.includes(phase + 1);
    
    user.completeQuizSession(phase, finalScore, questionsTotal);
    await user.save();

    res.json({
      success: true,
      message: 'Quiz session completed successfully',
      data: {
        phase,
        finalScore,
        previousBestScore: previousPhaseScore,
        newPhaseUnlocked: newPhaseUnlocked ? phase + 1 : null,
        totalXP: user.profile.totalXP,
        level: user.profile.level,
        unlockedPhases: user.progress.unlockedPhases
      }
    });

  } catch (error) {
    console.error('Complete quiz session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete quiz session'
    });
  }
});

// Reset quiz session (start over)
router.post('/reset-session', auth, [
  body('phase')
    .isInt({ min: 1, max: 5 })
    .withMessage('Phase must be between 1 and 5')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages: errors.array().map(err => err.msg)
      });
    }

    const { phase } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if phase is unlocked
    if (!user.isPhaseUnlocked(phase)) {
      return res.status(403).json({
        success: false,
        error: 'Phase not unlocked'
      });
    }

    // Reset quiz session
    user.resetQuizSession(phase);
    await user.save();

    res.json({
      success: true,
      message: 'Quiz session reset successfully',
      data: {
        phase,
        session: user.getQuizSession(phase)
      }
    });

  } catch (error) {
    console.error('Reset quiz session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset quiz session'
    });
  }
});

// Get quiz history
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 20, page = 1 } = req.query;

    // Find user
    const user = await User.findById(userId).select('profile.quizHistory');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get quiz history (sorted by most recent first)
    const quizHistory = user.profile.quizHistory || [];
    const sortedHistory = quizHistory.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedHistory = sortedHistory.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        history: paginatedHistory,
        totalSessions: quizHistory.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(quizHistory.length / limit),
        hasMore: endIndex < quizHistory.length
      }
    });

  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get quiz history'
    });
  }
});

module.exports = router;