import { Router } from 'express';
import { HazardController } from '../controllers/hazardController';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, HazardController.list);
router.get('/create', requireAuth, HazardController.showCreate);
router.post('/create', requireAuth, HazardController.create);
router.get('/:id', requireAuth, HazardController.detail);
router.post('/:id/delete', requireAdmin, HazardController.delete);
router.post('/:id/log', requireAuth, HazardController.addLog);

export default router;
