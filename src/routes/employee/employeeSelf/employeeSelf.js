import { Router } from 'express';
import Employee from '../../../controllers/Employee/Employee';
import loginRequired from '../../../middlewares/loginRequired';
import selfUpdateMw from '../../../middlewares/selfUpdateMw';

const router = new Router();

router.patch('/:id', loginRequired, selfUpdateMw, Employee.UpdateSelf);

export default router;
