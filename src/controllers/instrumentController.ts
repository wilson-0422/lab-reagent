import { Request, Response } from 'express';
import { InstrumentService } from '../services/instrumentService';

export class InstrumentController {
  static list(req: Request, res: Response): void {
    const instruments = InstrumentService.findAll();
    res.render('instruments/list', { instruments });
  }

  static detail(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const instrument = InstrumentService.findById(id);
    if (!instrument) {
      res.status(404).render('index', { error: '仪器未找到' });
      return;
    }
    const reservations = InstrumentService.getReservations(id);
    res.render('instruments/detail', { instrument, reservations });
  }

  static showReserve(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const instrument = InstrumentService.findById(id);
    if (!instrument) {
      res.status(404).render('index', { error: '仪器未找到' });
      return;
    }
    res.render('instruments/reserve', { instrument, error: null });
  }

  static reserve(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const { start_time, end_time, purpose } = req.body;
    const userId = req.session.userId!;

    const hasConflict = InstrumentService.checkConflict(id, start_time, end_time);
    if (hasConflict) {
      const instrument = InstrumentService.findById(id);
      res.render('instruments/reserve', { instrument, error: '该时间段已被预约，请选择其他时间' });
      return;
    }

    InstrumentService.createReservation({
      instrument_id: id,
      user_id: userId,
      start_time,
      end_time,
      purpose
    });
    res.redirect(`/instruments/${id}`);
  }

  static updateReservationStatus(req: Request, res: Response): void {
    const reservationId = parseInt(req.params.reservationId);
    const { status } = req.body;
    InstrumentService.updateReservationStatus(reservationId, status);
    const id = parseInt(req.params.id);
    res.redirect(`/instruments/${id}`);
  }
}
