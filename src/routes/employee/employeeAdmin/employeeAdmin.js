import { Router } from 'express';
import EmployeeAdmin from '../../../controllers/Employee/EmployeeAdmin/EmployeeAdmin';
import loginRequiredSuperAdmin from '../../../middlewares/loginRequiredSuperAdmin';
import superAdminPermissionMw from '../../../middlewares/superAdminPermissionMw';

const router = new Router();

router.post('/', loginRequiredSuperAdmin, superAdminPermissionMw, EmployeeAdmin.Store);
router.put('/:id', loginRequiredSuperAdmin, superAdminPermissionMw, EmployeeAdmin.Update);

export default router;
