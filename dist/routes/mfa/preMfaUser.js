"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _mfaAuth = require('../../controllers/mfaAuth'); var _mfaAuth2 = _interopRequireDefault(_mfaAuth);
var _preMfaUsers = require('../../middlewares/preMfaUsers'); var _preMfaUsers2 = _interopRequireDefault(_preMfaUsers);

const router = new (0, _express.Router)();

router.post('/', _preMfaUsers2.default, _mfaAuth2.default.GenerateCode);

exports. default = router;
