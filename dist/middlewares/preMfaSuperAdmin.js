"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable camelcase */
var _authErrors = require('../errors/authErrors');
var _Employee = require('../models/Employee'); var _Employee2 = _interopRequireDefault(_Employee);
var _MfaSuperAdmin = require('../repositories/MfaSuperAdmin/MfaSuperAdmin'); var _MfaSuperAdmin2 = _interopRequireDefault(_MfaSuperAdmin);
var _SearchMfaData = require('../repositories/MfaSuperAdmin/SearchMfaData'); var _SearchMfaData2 = _interopRequireDefault(_SearchMfaData);
var _secretsHandler = require('../secretsHandler'); var _secretsHandler2 = _interopRequireDefault(_secretsHandler);

// eslint-disable-next-line consistent-return
exports. default = async (req, res, next) => {
  try {
    const getSuperAdminPermission = _secretsHandler2.default.call(void 0, 'superAdmin');
    const getPass1 = _secretsHandler2.default.call(void 0, 'Pass1');
    const getPass2 = _secretsHandler2.default.call(void 0, 'Pass2');
    const correctEmail = _secretsHandler2.default.call(void 0, 'correctEmail');
    const {
      permission, verify_email, adminpassword, password1, password2, password3,
    } = req.headers;

    if (!permission || !verify_email || !adminpassword || !password1 || !password2 || !password3) {
      // mudar esta mensagem?
      throw new (0, _authErrors.Unauthorized)('Dados de autenticação não enviados');
    }

    if (password1 !== getPass1 && password2
        !== getPass2 && verify_email !== correctEmail) {
      throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');
    }

    const superAdmin = await _Employee2.default.findOne({
      where: {
        email: verify_email,
        is_active: 1,
      },
    });

    const searchCodeRegister = await _SearchMfaData2.default.SearchByEmail(verify_email);

    const passwordVerify = await superAdmin.PasswordValidator(password3);
    const adminPasswordVerify = await superAdmin.AdminPasswordValidator(adminpassword);

    // eslint-disable-next-line default-case
    switch (true) {
      case superAdmin.dataValues.email !== verify_email:
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

      case passwordVerify !== true:
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

      case adminPasswordVerify !== true:
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

      case superAdmin.dataValues.permission !== permission:
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

      case getSuperAdminPermission !== permission:
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

        // Para invalidar códigos anteriores
      case searchCodeRegister.dataValues.email !== null:
        if (searchCodeRegister.dataValues.email === verify_email) {
          await _MfaSuperAdmin2.default.Delete(searchCodeRegister.dataValues.id);
        }
    }

    return next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};
