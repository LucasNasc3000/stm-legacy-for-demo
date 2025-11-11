import { Router } from 'express';
import tokenController from '../../controllers/Auth/Token';
import codeVerify from '../../middlewares/codeVerify';

const router = new Router();

router.post('/', codeVerify, tokenController.Store);

export default router;
