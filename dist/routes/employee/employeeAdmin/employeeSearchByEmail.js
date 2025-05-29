"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _EmployeeSearchCredentialsAdmin = require('../../../controllers/Employee/EmployeeAdmin/EmployeeSearchCredentialsAdmin'); var _EmployeeSearchCredentialsAdmin2 = _interopRequireDefault(_EmployeeSearchCredentialsAdmin);
var _loginRequired = require('../../../middlewares/loginRequired'); var _loginRequired2 = _interopRequireDefault(_loginRequired);
var _superAdminPermissionMw = require('../../../middlewares/superAdminPermissionMw'); var _superAdminPermissionMw2 = _interopRequireDefault(_superAdminPermissionMw);

const router = new (0, _express.Router)();

router.get('/:email', _loginRequired2.default, _superAdminPermissionMw2.default, _EmployeeSearchCredentialsAdmin2.default.SearchByEmail);

exports. default = router;
