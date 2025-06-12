import { Router } from 'express';
import EmployeeAdmin from '../../../controllers/Employee/EmployeeAdmin/EmployeeAdmin';
import loginRequired from '../../../middlewares/loginRequired';
import superAdminPermissionMw from '../../../middlewares/superAdminPermissionMw';

const router = new Router();

router.post('/', loginRequired, superAdminPermissionMw, EmployeeAdmin.Store);
router.put('/:id', loginRequired, superAdminPermissionMw, EmployeeAdmin.Update);

export default router;
