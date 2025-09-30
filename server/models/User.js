const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  email: {
    type: String,
    sparse: true, // Optional field, but unique if provided
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  profile: {
    avatar: {
      type: String,
      default: null
    },
    totalXP: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    achievements: [{
      id: String,
      name: String,
      description: String,
      icon: String,
      dateEarned: {
        type: Date,
        default: Date.now
      }
    }],
    quizHistory: [{
      phase: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      score: {
        type: Number,
        required: true,
        min: 0
      },
      questionsTotal: {
        type: Number,
        required: true,
        min: 1
      },
      percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      completedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  progress: {
    currentPhase: {
      type: Number,
      default: 1,
      min: 1,
      max: 5
    },
    unlockedPhases: {
      type: [Number],
      default: [1]
    },
    phaseScores: {
      phase1: { type: Number, default: 0 },
      phase2: { type: Number, default: 0 },
      phase3: { type: Number, default: 0 },
      phase4: { type: Number, default: 0 },
      phase5: { type: Number, default: 0 }
    },
    lastQuizDate: {
      type: Date,
      default: null
    },
    streakDays: {
      type: Number,
      default: 0
    },
    // Quiz session tracking for each phase
    quizSessions: {
      phase1: {
        currentQuestionIndex: { type: Number, default: 0 },
        sessionScore: { type: Number, default: 0 },
        sessionAnswers: { type: Array, default: [] },
        sessionStartTime: { type: Date, default: null },
        sessionCompleted: { type: Boolean, default: false }
      },
      phase2: {
        currentQuestionIndex: { type: Number, default: 0 },
        sessionScore: { type: Number, default: 0 },
        sessionAnswers: { type: Array, default: [] },
        sessionStartTime: { type: Date, default: null },
        sessionCompleted: { type: Boolean, default: false }
      },
      phase3: {
        currentQuestionIndex: { type: Number, default: 0 },
        sessionScore: { type: Number, default: 0 },
        sessionAnswers: { type: Array, default: [] },
        sessionStartTime: { type: Date, default: null },
        sessionCompleted: { type: Boolean, default: false }
      },
      phase4: {
        currentQuestionIndex: { type: Number, default: 0 },
        sessionScore: { type: Number, default: 0 },
        sessionAnswers: { type: Array, default: [] },
        sessionStartTime: { type: Date, default: null },
        sessionCompleted: { type: Boolean, default: false }
      },
      phase5: {
        currentQuestionIndex: { type: Number, default: 0 },
        sessionScore: { type: Number, default: 0 },
        sessionAnswers: { type: Array, default: [] },
        sessionStartTime: { type: Date, default: null },
        sessionCompleted: { type: Boolean, default: false }
      }
    }
  },
  settings: {
    darkMode: {
      type: Boolean,
      default: false
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to update phase progress
userSchema.methods.updatePhaseScore = function(phase, score) {
  const phaseKey = `phase${phase}`;
  this.progress.phaseScores[phaseKey] = Math.max(this.progress.phaseScores[phaseKey], score);
  
  // Production: Phase 1 unlocks Phase 2 when score >= 45 (90%)
  const unlockThreshold = phase === 1 ? 45 : 45;
  if (score >= unlockThreshold && phase < 5) {
    const nextPhase = phase + 1;
    if (!this.progress.unlockedPhases.includes(nextPhase)) {
      this.progress.unlockedPhases.push(nextPhase);
    }
  }
  
  // Update total XP
  this.profile.totalXP += score;
  
  // Update level (every 100 XP = 1 level)
  this.profile.level = Math.floor(this.profile.totalXP / 100) + 1;
  
  // Update last quiz date
  this.progress.lastQuizDate = new Date();
};

// Instance method to check if phase is unlocked
userSchema.methods.isPhaseUnlocked = function(phase) {
  return this.progress.unlockedPhases.includes(phase);
};

// Instance method to save quiz session progress
userSchema.methods.saveQuizSession = function(phase, currentQuestionIndex, sessionScore, sessionAnswers) {
  const phaseKey = `phase${phase}`;
  
  if (!this.progress.quizSessions[phaseKey]) {
    this.progress.quizSessions[phaseKey] = {
      currentQuestionIndex: 0,
      sessionScore: 0,
      sessionAnswers: [],
      sessionStartTime: new Date(),
      sessionCompleted: false
    };
  }
  
  this.progress.quizSessions[phaseKey].currentQuestionIndex = currentQuestionIndex;
  this.progress.quizSessions[phaseKey].sessionScore = sessionScore;
  this.progress.quizSessions[phaseKey].sessionAnswers = sessionAnswers;
  
  // Set start time if this is the first question
  if (currentQuestionIndex === 0 && !this.progress.quizSessions[phaseKey].sessionStartTime) {
    this.progress.quizSessions[phaseKey].sessionStartTime = new Date();
  }
  
  // Mark session as not completed
  this.progress.quizSessions[phaseKey].sessionCompleted = false;
};

// Instance method to complete quiz session
userSchema.methods.completeQuizSession = function(phase, finalScore, questionsTotal = 50) {
  const phaseKey = `phase${phase}`;
  
  if (this.progress.quizSessions[phaseKey]) {
    this.progress.quizSessions[phaseKey].sessionCompleted = true;
    this.progress.quizSessions[phaseKey].sessionScore = finalScore;
  }
  
  // Update phase score with final score
  this.updatePhaseScore(phase, finalScore);
  
  // Record quiz completion in history
  this.recordQuizCompletion(phase, finalScore, questionsTotal);
};

// Instance method to record quiz completion in history
userSchema.methods.recordQuizCompletion = function(phase, score, questionsTotal) {
  const percentage = Math.round((score / questionsTotal) * 100);
  
  this.profile.quizHistory.push({
    phase,
    score,
    questionsTotal,
    percentage,
    completedAt: new Date()
  });
  
  // Keep only last 100 quiz history entries to prevent unlimited growth
  if (this.profile.quizHistory.length > 100) {
    this.profile.quizHistory = this.profile.quizHistory.slice(-100);
  }
};

// Instance method to reset quiz session
userSchema.methods.resetQuizSession = function(phase) {
  const phaseKey = `phase${phase}`;
  
  if (this.progress.quizSessions[phaseKey]) {
    this.progress.quizSessions[phaseKey].currentQuestionIndex = 0;
    this.progress.quizSessions[phaseKey].sessionScore = 0;
    this.progress.quizSessions[phaseKey].sessionAnswers = [];
    this.progress.quizSessions[phaseKey].sessionStartTime = null;
    this.progress.quizSessions[phaseKey].sessionCompleted = false;
  }
};

// Instance method to get quiz session
userSchema.methods.getQuizSession = function(phase) {
  const phaseKey = `phase${phase}`;
  return this.progress.quizSessions[phaseKey] || {
    currentQuestionIndex: 0,
    sessionScore: 0,
    sessionAnswers: [],
    sessionStartTime: null,
    sessionCompleted: false
  };
};

// Static method to find user by username
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username });
};

module.exports = mongoose.model('User', userSchema);