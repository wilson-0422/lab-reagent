import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

router.get('/login', AuthController.showLogin);
router.post('/login', AuthController.login);
router.get('/register', AuthController.showRegister);
router.post('/register', AuthController.register);
router.get('/logout', AuthController.logout);

export default router;
