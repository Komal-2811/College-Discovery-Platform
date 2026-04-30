import { Router } from 'express';
import { getColleges, getCollegeById, addReview } from '../controllers/college.controller';

const router = Router();

router.get('/', getColleges);
router.get('/:id', getCollegeById);
router.post('/:id/reviews', addReview);

export default router;
