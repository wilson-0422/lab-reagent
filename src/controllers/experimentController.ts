import { Request, Response } from 'express';
import { ExperimentService } from '../services/experimentService';

export class ExperimentController {
  static list(req: Request, res: Response): void {
    const experiments = ExperimentService.findAll();
    res.render('experiments/list', { experiments });
  }

  static detail(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const experiment = ExperimentService.findById(id);
    if (!experiment) {
      res.status(404).render('index', { error: '实验记录未找到' });
      return;
    }
    res.render('experiments/detail', { experiment });
  }

  static showCreate(req: Request, res: Response): void {
    res.render('experiments/create', { error: null });
  }

  static create(req: Request, res: Response): void {
    try {
      const userId = req.session.userId!;
      const experiment = ExperimentService.create({ ...req.body, user_id: userId });
      res.redirect(`/experiments/${experiment.id}`);
    } catch (err: any) {
      res.render('experiments/create', { error: err.message });
    }
  }

  static updateStatus(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    ExperimentService.update(id, { status });
    res.redirect(`/experiments/${id}`);
  }

  static delete(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    ExperimentService.delete(id);
    res.redirect('/experiments');
  }
}
