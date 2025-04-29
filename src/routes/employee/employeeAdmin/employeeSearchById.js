import { Router } from 'express';
import EmployeeSearchCredentialsAdmin from '../../../controllers/Employee/EmployeeAdmin/EmployeeSearchCredentialsAdmin';
import loginRequired from '../../../middlewares/loginRequired';
import superAdminPermissionMw from '../../../middlewares/superAdminPermissionMw';

const router = new Router();

router.get('/:id', loginRequired, superAdminPermissionMw, EmployeeSearchCredentialsAdmin.SearchByID);

export default router;
