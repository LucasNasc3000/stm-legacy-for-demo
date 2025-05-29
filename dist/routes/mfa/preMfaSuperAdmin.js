"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _mfaAuthSuperAdmin = require('../../controllers/mfaAuthSuperAdmin'); var _mfaAuthSuperAdmin2 = _interopRequireDefault(_mfaAuthSuperAdmin);
var _preMfaSuperAdmin = require('../../middlewares/preMfaSuperAdmin'); var _preMfaSuperAdmin2 = _interopRequireDefault(_preMfaSuperAdmin);

const router = new (0, _express.Router)();

router.post('/', _preMfaSuperAdmin2.default, _mfaAuthSuperAdmin2.default.GenerateCode);

exports. default = router;
