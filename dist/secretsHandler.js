"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _fs = require('fs'); var fs = _interopRequireWildcard(_fs);
var _path = require('path'); var path = _interopRequireWildcard(_path);

 function SecretsHandler(secretName) {
  try {
    const secretsDir = '/run/secrets';

    const secretsPath = path.join(secretsDir, secretName);

    return fs.readFileSync(secretsPath, 'utf-8').trim();
  } catch (err) {
    console.log('Erro de variável(s) de ambiente');
  }
} exports.default = SecretsHandler;
