import { Router } from 'express';
import EmployeeSearchCredentialsAdmin from '../../../controllers/Employee/EmployeeAdmin/EmployeeSearchCredentialsAdmin';
import loginRequired from '../../../middlewares/loginRequired';
import superAdminPermissionMw from '../../../middlewares/superAdminPermissionMw';

const router = new Router();

router.get('/:email', loginRequired, superAdminPermissionMw, EmployeeSearchCredentialsAdmin.SearchByEmail);

export default router;
