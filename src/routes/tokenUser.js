import { Router } from 'express';
import tokenController from '../controllers/Token';
import codeVerifyUser from '../middlewares/codeVerifyUser';

const router = new Router();

router.post('/', codeVerifyUser, tokenController.Store);

export default router;
