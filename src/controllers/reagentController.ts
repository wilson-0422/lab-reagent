import { Request, Response } from 'express';
import { ReagentService } from '../services/reagentService';

export class ReagentController {
  static list(req: Request, res: Response): void {
    const reagents = ReagentService.findAll();
    res.render('reagents/list', { reagents });
  }

  static detail(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const reagent = ReagentService.findById(id);
    if (!reagent) {
      res.status(404).render('index', { error: '试剂未找到' });
      return;
    }
    const logs = ReagentService.getLogs(id);
    res.render('reagents/detail', { reagent, logs });
  }

  static showCreate(req: Request, res: Response): void {
    res.render('reagents/create', { error: null });
  }

  static create(req: Request, res: Response): void {
    try {
      const reagent = ReagentService.create(req.body);
      res.redirect(`/reagents/${reagent.id}`);
    } catch (err: any) {
      res.render('reagents/create', { error: err.message });
    }
  }

  static showEdit(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const reagent = ReagentService.findById(id);
    if (!reagent) {
      res.status(404).render('index', { error: '试剂未找到' });
      return;
    }
    res.render('reagents/edit', { reagent, error: null });
  }

  static update(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    try {
      ReagentService.update(id, req.body);
      res.redirect(`/reagents/${id}`);
    } catch (err: any) {
      const reagent = ReagentService.findById(id);
      res.render('reagents/edit', { reagent, error: err.message });
    }
  }

  static delete(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    ReagentService.delete(id);
    res.redirect('/reagents');
  }

  static addLog(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const { action, quantity, remark } = req.body;
    const userId = req.session.userId!;
    ReagentService.addLog(id, userId, action, parseInt(quantity), remark);
    res.redirect(`/reagents/${id}`);
  }
}
