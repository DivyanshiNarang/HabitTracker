import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { chatAnalysis, morningMotivation, recoveryPlan, suggestHabits, weeklyReport } from '../controllers/ai.controller.js';

const router = Router();

router.use(protect);

router.post('/weekly-report', weeklyReport);
router.post('/suggest-habits', suggestHabits);
router.post('/recovery-plan', recoveryPlan);
router.get('/chat', chatAnalysis);
router.get('/morning', morningMotivation);

export default router;