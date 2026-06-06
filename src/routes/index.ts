import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { requireAuth } from '../middleware/auth';
import authRoutes from './auth';
import reagentRoutes from './reagents';
import hazardRoutes from './hazards';
import instrumentRoutes from './instruments';
import experimentRoutes from './experiments';

const router = Router();

router.get('/', requireAuth, DashboardController.overview);
router.get('/dashboard', requireAuth, DashboardController.overview);

router.use('/auth', authRoutes);
router.use('/reagents', reagentRoutes);
router.use('/hazards', hazardRoutes);
router.use('/instruments', instrumentRoutes);
router.use('/experiments', experimentRoutes);

export default router;
