import { Router } from 'express';
import { InstrumentController } from '../controllers/instrumentController';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, InstrumentController.list);
router.get('/:id', requireAuth, InstrumentController.detail);
router.get('/:id/reserve', requireAuth, InstrumentController.showReserve);
router.post('/:id/reserve', requireAuth, InstrumentController.reserve);
router.post('/:id/reservation/:reservationId', requireAdmin, InstrumentController.updateReservationStatus);

export default router;
