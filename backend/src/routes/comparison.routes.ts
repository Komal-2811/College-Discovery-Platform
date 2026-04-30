import { Router } from 'express';
import { createComparison, getComparison, deleteComparison } from '../controllers/comparison.controller';

const router = Router();

router.post('/', createComparison);
router.get('/:id', getComparison);
router.delete('/:id', deleteComparison);

export default router;
