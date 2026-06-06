import { Request, Response } from 'express';
import { ReagentService } from '../services/reagentService';
import { HazardService } from '../services/hazardService';
import { InstrumentService } from '../services/instrumentService';
import { ExperimentService } from '../services/experimentService';

export class DashboardController {
  static overview(req: Request, res: Response): void {
    const reagentCount = ReagentService.count();
    const hazardCount = HazardService.count();
    const instrumentCount = InstrumentService.count();
    const experimentCount = ExperimentService.count();
    const lowStockReagents = ReagentService.getLowStockReagents();
    const pendingReservations = InstrumentService.getReservationCount();
    const draftExperiments = ExperimentService.countByStatus('草稿');

    res.render('dashboard/overview', {
      reagentCount,
      hazardCount,
      instrumentCount,
      experimentCount,
      lowStockReagents,
      pendingReservations,
      draftExperiments
    });
  }
}
