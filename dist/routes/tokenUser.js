"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _Token = require('../controllers/Token'); var _Token2 = _interopRequireDefault(_Token);
var _codeVerifyUser = require('../middlewares/codeVerifyUser'); var _codeVerifyUser2 = _interopRequireDefault(_codeVerifyUser);

const router = new (0, _express.Router)();

router.post('/', _codeVerifyUser2.default, _Token2.default.Store);

exports. default = router;
