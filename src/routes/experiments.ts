import { Router } from 'express';
import { ExperimentController } from '../controllers/experimentController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, ExperimentController.list);
router.get('/create', requireAuth, ExperimentController.showCreate);
router.post('/create', requireAuth, ExperimentController.create);
router.get('/:id', requireAuth, ExperimentController.detail);
router.post('/:id/status', requireAuth, ExperimentController.updateStatus);
router.post('/:id/delete', requireAuth, ExperimentController.delete);

export default router;
