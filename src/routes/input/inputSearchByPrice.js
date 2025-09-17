import { Router } from 'express';
import inputSearchSimpleStrings from '../../controllers/Input/InputSearchSimpleStrings';
import inputsPermission from '../../middlewares/inputsPermission';
import loginRequired from '../../middlewares/loginRequired';

const router = new Router();

router.get('/:price', loginRequired, inputsPermission, inputSearchSimpleStrings.SearchByPrice);

export default router;
