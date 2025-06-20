"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _EmployeeAdmin = require('../../../controllers/Employee/EmployeeAdmin/EmployeeAdmin'); var _EmployeeAdmin2 = _interopRequireDefault(_EmployeeAdmin);
var _loginRequired = require('../../../middlewares/loginRequired'); var _loginRequired2 = _interopRequireDefault(_loginRequired);
var _superAdminPermissionMw = require('../../../middlewares/superAdminPermissionMw'); var _superAdminPermissionMw2 = _interopRequireDefault(_superAdminPermissionMw);

const router = new (0, _express.Router)();

router.post('/', _EmployeeAdmin2.default.Store);
router.put('/:id', _loginRequired2.default, _superAdminPermissionMw2.default, _EmployeeAdmin2.default.Update);

exports. default = router;
