"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable camelcase */
var _authErrors = require('../errors/authErrors');
var _serverErrors = require('../errors/serverErrors');
var _hash = require('../hashing/hash'); var _hash2 = _interopRequireDefault(_hash);
var _Mfa = require('../repositories/Mfa/Mfa'); var _Mfa2 = _interopRequireDefault(_Mfa);
var _SearchMfaData = require('../repositories/Mfa/SearchMfaData'); var _SearchMfaData2 = _interopRequireDefault(_SearchMfaData);

// eslint-disable-next-line consistent-return
exports. default = async (req, res, next) => {
  try {
    const { verifyemail, code } = req.headers;

    if (!verifyemail || !code) throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

    const searchByEmailMfa = await _SearchMfaData2.default.SearchByEmail(verifyemail);

    if (!searchByEmailMfa) throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

    const { is_valid } = searchByEmailMfa.dataValues;

    // eslint-disable-next-line default-case
    switch (true) {
      case !is_valid:
        throw new (0, _authErrors.Unauthorized)('Código expirado');

      case typeof is_valid === 'boolean':
        if (is_valid !== true) throw new (0, _authErrors.Unauthorized)('Código expirado');
        break;

      case typeof is_valid === 'number':
        if (is_valid !== 1) throw new (0, _authErrors.Unauthorized)('Código expirado');
        break;
    }

    const { sequence_hash } = searchByEmailMfa.dataValues;

    const hashCompare = await _hash2.default.Compare(code, sequence_hash);

    if (hashCompare !== true) throw new (0, _authErrors.Unauthorized)('Código inválido');

    const invalidateMfaData = await _Mfa2.default.Update(searchByEmailMfa.dataValues.id, {
      is_valid: false,
    });

    if (invalidateMfaData === 'código não encontrado') throw new (0, _serverErrors.InternalServerError)('Erro desconhecido ao tentar logar');

    next();
  } catch (e) {
    next(e);
  }
};
