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
    const getAdminPermission = _secretsHandler2.default.call(void 0, 'admin');
    const getInputsPermission = _secretsHandler2.default.call(void 0, 'inputsAccess');
    const getOutputsPermission = _secretsHandler2.default.call(void 0, 'outputsAccess');
    const getSalesPermission = _secretsHandler2.default.call(void 0, 'salesAccess');
    const getSalesOutputsPermission = _secretsHandler2.default.call(void 0, 'salesOutputsAccess');
    const getInputsOutputsPermission = _secretsHandler2.default.call(void 0, 'inputsOutputsAccess');
    const getSalesOutputsInputsPermission = _secretsHandler2.default.call(void 0, 'salesOutputsInputsAccess');
    const {
      permission, email, adminpassword,
    } = req.headers;

    if (!permission || !email || !adminpassword) throw new (0, _authErrors.Unauthorized)('Dados de autenticação não enviados');

    const userVerify = await _Employee2.default.findOne({
      where: {
        email,
        is_active: 1,
        permission,
      },
    });

    const searchCodeRegister = await _SearchMfaData2.default.SearchByEmail(email);
    const adminPasswordVerify = await userVerify.AdminPasswordValidator(adminpassword);

    if (permission !== getAdminPermission
        && permission !== getInputsPermission
        && permission !== getOutputsPermission
        && permission !== getSalesPermission
        && permission !== getInputsOutputsPermission
        && permission !== getSalesOutputsPermission
        && permission !== getSalesOutputsInputsPermission) {
      throw new (0, _authErrors.Unauthorized)('Permissão inválida');
    }

    // eslint-disable-next-line default-case
    switch (true) {
      case userVerify === null:
        throw new (0, _notFound.NotFound)('Usuário não encontrado');

      case adminPasswordVerify !== true:
        throw new (0, _authErrors.Unauthorized)('Credenciais inválidas');

        // Para invalidar códigos anteriores
      case searchCodeRegister !== null:
        if (searchCodeRegister.dataValues.email === email) {
          await _Mfa2.default.Update(searchCodeRegister.dataValues.id, {
            is_valid: false,
          });
        }
        next();
    }

    return next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};
