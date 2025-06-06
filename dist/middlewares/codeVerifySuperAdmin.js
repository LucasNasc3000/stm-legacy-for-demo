"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable camelcase */
var _authErrors = require('../errors/authErrors');
var _serverErrors = require('../errors/serverErrors');
var _hash = require('../hashing/hash'); var _hash2 = _interopRequireDefault(_hash);
var _MfaSuperAdmin = require('../repositories/MfaSuperAdmin/MfaSuperAdmin'); var _MfaSuperAdmin2 = _interopRequireDefault(_MfaSuperAdmin);
var _SearchMfaData = require('../repositories/MfaSuperAdmin/SearchMfaData'); var _SearchMfaData2 = _interopRequireDefault(_SearchMfaData);

// eslint-disable-next-line consistent-return
exports. default = async (req, res, next) => {
  try {
    const { verifyemail, code } = req.headers;

    if (!verifyemail || !code) throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

    const searchByEmailMfa = await _SearchMfaData2.default.SearchByEmail(verifyemail);

    if (!searchByEmailMfa) throw new (0, _authErrors.Unauthorized)('Código expirado ou credenciais inválidas');

    const { sequence_hash } = searchByEmailMfa.dataValues;

    const hashCompare = await _hash2.default.Compare(code, sequence_hash);

    if (hashCompare !== true) throw new (0, _authErrors.Unauthorized)('Código inválido');

    const invalidateMfaData = await _MfaSuperAdmin2.default.Update(searchByEmailMfa.dataValues.id, {
      is_valid: false,
    });

    if (invalidateMfaData === 'código não encontrado') throw new (0, _serverErrors.InternalServerError)('Erro desconhecido ao tentar logar');

    next();
  } catch (e) {
    next(e);
  }
};
