import { Request, Response } from 'express';
import { HazardService } from '../services/hazardService';

export class HazardController {
  static list(req: Request, res: Response): void {
    const hazards = HazardService.findAll();
    res.render('hazards/list', { hazards });
  }

  static detail(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const hazard = HazardService.findById(id);
    if (!hazard) {
      res.status(404).render('index', { error: '危化品未找到' });
      return;
    }
    const logs = HazardService.getLogs(id);
    res.render('hazards/detail', { hazard, logs });
  }

  static showCreate(req: Request, res: Response): void {
    res.render('hazards/create', { error: null });
  }

  static create(req: Request, res: Response): void {
    try {
      const hazard = HazardService.create(req.body);
      res.redirect(`/hazards/${hazard.id}`);
    } catch (err: any) {
      res.render('hazards/create', { error: err.message });
    }
  }

  static delete(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    HazardService.delete(id);
    res.redirect('/hazards');
  }

  static addLog(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const { action, quantity, remark } = req.body;
    const userId = req.session.userId!;
    HazardService.addLog(id, userId, action, parseInt(quantity), remark);
    res.redirect(`/hazards/${id}`);
  }
}
