import { Router } from 'express';
import { getAllStats, getHabitStats, getHeatMap, getToday, markCompleted, unmarkComplete } from '../controllers/log.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.use(protect);

router
    .route('/')
    .post(markCompleted)
    .delete(unmarkComplete);

router.get('/today', getToday);
router.get('/range', getRange);
router.get('/heatmap', getHeatMap);
router.get('/stats', getAllStats);
router.get('/stats/:habitId', getHabitStats);

export default router;