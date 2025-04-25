import { Router } from 'express';
import mfaAuthSuperAdmin from '../../controllers/mfaAuthSuperAdmin';
import preMfaSuperAdmin from '../../middlewares/preMfaSuperAdmin';

const router = new Router();

router.post('/', preMfaSuperAdmin, mfaAuthSuperAdmin.GenerateCode);

export default router;
