const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Update quiz progress
router.post('/update-quiz', auth, [
  body('phase')
    .isInt({ min: 1, max: 5 })
    .withMessage('Phase must be between 1 and 5'),
  body('score')
    .isInt({ min: 0, max: 50 })
    .withMessage('Score must be between 0 and 50')
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

    const { phase, score } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user has access to this phase
    if (!user.isPhaseUnlocked(phase)) {
      return res.status(403).json({
        success: false,
        error: `Phase ${phase} is not unlocked`
      });
    }

    // Update phase score and progress
    const previousScore = user.progress.phaseScores[`phase${phase}`] || 0;
    user.updatePhaseScore(phase, score);

    // Save user
    await user.save();

    // Check if new phase was unlocked
    const newPhaseUnlocked = score >= 45 && phase < 5 && !user.progress.unlockedPhases.includes(phase + 1);

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        phase,
        score,
        previousScore,
        newPhaseUnlocked: newPhaseUnlocked ? phase + 1 : null,
        totalXP: user.profile.totalXP,
        level: user.profile.level,
        unlockedPhases: user.progress.unlockedPhases
      }
    });

  } catch (error) {
    console.error('Update quiz progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update progress'
    });
  }
});

// Get user progress
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      progress: {
        currentPhase: user.progress.currentPhase,
        unlockedPhases: user.progress.unlockedPhases,
        phaseScores: user.progress.phaseScores,
        totalXP: user.profile.totalXP,
        level: user.profile.level,
        achievements: user.profile.achievements,
        streakDays: user.progress.streakDays,
        lastQuizDate: user.progress.lastQuizDate
      }
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get progress'
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const leaderboard = await User.find()
      .select('username profile.totalXP profile.level progress.unlockedPhases')
      .sort({ 'profile.totalXP': -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      leaderboard: leaderboard.map((user, index) => ({
        rank: skip + index + 1,
        username: user.username,
        totalXP: user.profile.totalXP,
        level: user.profile.level,
        phasesUnlocked: user.progress.unlockedPhases.length
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
      }
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get leaderboard'
    });
  }
});

// Add achievement
router.post('/achievement', auth, [
  body('achievementId').notEmpty().withMessage('Achievement ID is required'),
  body('name').notEmpty().withMessage('Achievement name is required'),
  body('description').notEmpty().withMessage('Achievement description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages: errors.array().map(err => err.msg)
      });
    }

    const { achievementId, name, description, icon = '🏆' } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if achievement already exists
    const existingAchievement = user.profile.achievements.find(
      ach => ach.id === achievementId
    );

    if (existingAchievement) {
      return res.status(400).json({
        success: false,
        error: 'Achievement already earned'
      });
    }

    // Add achievement
    user.profile.achievements.push({
      id: achievementId,
      name,
      description,
      icon,
      dateEarned: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Achievement earned!',
      achievement: {
        id: achievementId,
        name,
        description,
        icon
      }
    });

  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add achievement'
    });
  }
});

module.exports = router;