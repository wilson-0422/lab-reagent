import { Router } from 'express';
import { ReagentController } from '../controllers/reagentController';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, ReagentController.list);
router.get('/create', requireAuth, ReagentController.showCreate);
router.post('/create', requireAuth, ReagentController.create);
router.get('/:id', requireAuth, ReagentController.detail);
router.get('/:id/edit', requireAuth, ReagentController.showEdit);
router.post('/:id/edit', requireAuth, ReagentController.update);
router.post('/:id/delete', requireAdmin, ReagentController.delete);
router.post('/:id/log', requireAuth, ReagentController.addLog);

export default router;
