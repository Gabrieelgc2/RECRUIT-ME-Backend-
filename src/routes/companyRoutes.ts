import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.ts';
import {
  registerCompanyHandler,
  loginCompanyHandler,
} from '../controllers/companyController.ts';

const router = Router();

router.post('/register', registerCompanyHandler);
router.post('/login', loginCompanyHandler);


export default router;