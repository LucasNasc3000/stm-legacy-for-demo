"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

exports. default = async (password, hashString) => {
  const generate = await _bcryptjs2.default.compare(password, hashString);
  return generate;
};
