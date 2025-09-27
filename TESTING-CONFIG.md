# Testing Configuration for Phase Unlocking

## What has been modified for testing:

### 1. Phase unlock threshold (server/models/User.js)
- **Changed from**: Phase 1 unlocks Phase 2 when score >= 45
- **Changed to**: Phase 1 unlocks Phase 2 when score >= 1 
- This allows Phase 2 to unlock with just 1 correct answer

### 2. Phase 1 quiz length (src/data/phase1/quiz-questions.json)
- **Changed from**: 50 questions
- **Changed to**: 2 questions only
- This makes testing much faster

### 3. File backups created:
- `quiz-questions-ORIGINAL.json` - Complete backup with all 50 original questions
- `quiz-questions-TEST.json` - Copy of the 2-question test version

## How to test phase unlocking:
1. Register a new user or login
2. Take the Phase 1 quiz (now only 2 questions)
3. Answer at least 1 question correctly
4. Phase 2 should automatically unlock

## How to revert to production settings:

### Step 1: Restore original quiz questions
```bash
cd "D:\voacb-app"
copy "src\data\phase1\quiz-questions-ORIGINAL.json" "src\data\phase1\quiz-questions.json"
```

### Step 2: Restore original unlock threshold
In `server/models/User.js`, change line 47:
```javascript
// Change from:
const requiredScore = phase === 1 ? 1 : 45;

// Back to:
const requiredScore = phase === 1 ? 45 : 45;
```

## Current test configuration allows:
- Quick 2-question Phase 1 quiz
- Phase 2 unlocks with score of 50% (1/2 correct)
- Easy testing of the phase progression system