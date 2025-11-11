import { Router } from 'express';
import mfaAuth from '../../controllers/Auth/mfaAuth';
import preMfaUsers from '../../middlewares/preMfaUsers';

const router = new Router();

router.post('/', preMfaUsers, mfaAuth.GenerateCodeUsers);

export default router;
