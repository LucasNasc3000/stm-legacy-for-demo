import { Router } from 'express';
import mfaAuth from '../../controllers/mfaAuth';
import preMfaUsers from '../../middlewares/preMfaUsers';

const router = new Router();

router.post('/', preMfaUsers, mfaAuth.GenerateCode);

export default router;
