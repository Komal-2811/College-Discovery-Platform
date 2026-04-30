import { Router } from 'express';
import { predictColleges } from '../controllers/predictor.controller';

const router = Router();

router.post('/predict', predictColleges);

export default router;
