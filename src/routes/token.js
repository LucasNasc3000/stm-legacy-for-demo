import { Router } from 'express';
import tokenController from '../controllers/Token';
import codeVerifySuperAdmin from '../middlewares/codeVerifySuperAdmin';

const router = new Router();

router.post('/', codeVerifySuperAdmin, tokenController.Store);

export default router;
