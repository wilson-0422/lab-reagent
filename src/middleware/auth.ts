import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    res.redirect('/auth/login');
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    res.redirect('/auth/login');
    return;
  }
  if (req.session.role !== 'admin') {
    res.status(403).send('权限不足，需要管理员权限');
    return;
  }
  next();
}
