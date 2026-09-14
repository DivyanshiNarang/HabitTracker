import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { archiveHabit, createHabit, deleteHabit, getHabits, reorderHabits, updateHabit } from '../controllers/habit.controller.js';

const router = Router();

router.use(protect);

router
    .route('/')
    .get(getHabits)
    .post(createHabit);

router.put('/reorder', reorderHabits);

router
    .route('/:id')
    .put(updateHabit)
    .delete(deleteHabit);

router.put('/:id/archive', archiveHabit);

export default router;