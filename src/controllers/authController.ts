import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class AuthController {
  static showLogin(req: Request, res: Response): void {
    res.render('auth/login', { error: null });
  }

  static login(req: Request, res: Response): void {
    const { username, password } = req.body;
    const user = UserService.verifyPassword(username, password);
    if (!user) {
      res.render('auth/login', { error: '用户名或密码错误' });
      return;
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.realName = user.real_name;
    req.session.role = user.role;
    res.redirect('/dashboard');
  }

  static showRegister(req: Request, res: Response): void {
    res.render('auth/register', { error: null });
  }

  static register(req: Request, res: Response): void {
    const { username, password, confirmPassword, real_name, department } = req.body;
    if (password !== confirmPassword) {
      res.render('auth/register', { error: '两次输入的密码不一致' });
      return;
    }
    const existing = UserService.findByUsername(username);
    if (existing) {
      res.render('auth/register', { error: '用户名已存在' });
      return;
    }
    const user = UserService.create({ username, password, real_name, department });
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.realName = user.real_name;
    req.session.role = user.role;
    res.redirect('/dashboard');
  }

  static logout(req: Request, res: Response): void {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  }
}
