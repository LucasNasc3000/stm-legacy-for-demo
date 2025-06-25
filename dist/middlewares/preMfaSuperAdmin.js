"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable camelcase */
var _authErrors = require('../errors/authErrors');
var _notFound = require('../errors/notFound');
var _Employee = require('../models/Employee'); var _Employee2 = _interopRequireDefault(_Employee);
var _Mfa = require('../repositories/Mfa/Mfa'); var _Mfa2 = _interopRequireDefault(_Mfa);
var _SearchMfaData = require('../repositories/Mfa/SearchMfaData'); var _SearchMfaData2 = _interopRequireDefault(_SearchMfaData);
var _secretsHandler = require('../secretsHandler'); var _secretsHandler2 = _interopRequireDefault(_secretsHandler);

// eslint-disable-next-line consistent-return
exports. default = async (req, res, next) => {
  try {
    const getSuperAdminPermission = _secretsHandler2.default.call(void 0, 'superAdmin');
    const getPass1 = _secretsHandler2.default.call(void 0, 'Pass1');
    const getPass2 = _secretsHandler2.default.call(void 0, 'Pass2');
    const correctEmail = _secretsHandler2.default.call(void 0, 'correctEmail');
    const {
      permission, verifyemail, adminpassword, password1, password2, password3,
    } = req.headers;

    console.log(req.headers);
    console.log(!permission || !verifyemail || !adminpassword || !password1 || !password2 || !password3);

    if (!permission || !verifyemail || !adminpassword || !password1 || !password2 || !password3) {
      // mudar esta mensagem?
      throw new (0, _authErrors.Unauthorized)('Dados de autenticação não enviados');
    }

    if (password1 !== getPass1 && password2
        !== getPass2 && verifyemail !== correctEmail) {
      throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');
    }

    const superAdmin = await _Employee2.default.findOne({
      where: {
        email: verifyemail,
        is_active: 1,
      },
    });

    const searchCodeRegister = await _SearchMfaData2.default.SearchByEmail(verifyemail);

    const passwordVerify = await superAdmin.PasswordValidator(password3);
    const adminPasswordVerify = await superAdmin.AdminPasswordValidator(adminpassword);

    // eslint-disable-next-line default-case
    switch (true) {
      case superAdmin === null:
        console.log('sw 1');
        throw new (0, _notFound.NotFound)('Super admin não encontrado');

      case superAdmin.dataValues.email !== verifyemail:
        console.log('sw 2');
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

      case passwordVerify !== true:
        console.log('sw 3');
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

      case adminPasswordVerify !== true:
        console.log('sw 4');
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

      case superAdmin.dataValues.permission !== permission:
        console.log('sw 5');
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

      case getSuperAdminPermission !== permission:
        console.log('sw 6');
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

        // Para invalidar códigos anteriores
      case searchCodeRegister !== null:
        if (searchCodeRegister.dataValues.email === verifyemail) {
          await _Mfa2.default.Update(searchCodeRegister.dataValues.id, {
            is_valid: false,
          });
        }
        next();
    }

    return next();
  } catch (e) {
    next(e);
  }
};
