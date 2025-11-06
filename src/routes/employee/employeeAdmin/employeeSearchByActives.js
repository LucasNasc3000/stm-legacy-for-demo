import { Router } from 'express';
import EmployeeSearchCredentialsAdmin from '../../../controllers/Employee/EmployeeAdmin/EmployeeSearchCredentialsAdmin';
import loginRequiredSuperAdmin from '../../../middlewares/loginRequiredSuperAdmin';
import superAdminPermissionMw from '../../../middlewares/superAdminPermissionMw';

const router = new Router();

router.get('/', loginRequiredSuperAdmin, superAdminPermissionMw, EmployeeSearchCredentialsAdmin.SearchForActives);

export default router;
