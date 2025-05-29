"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable consistent-return */
/* eslint-disable default-case */
var _authErrors = require('../errors/authErrors');
var _clientErrors = require('../errors/clientErrors');
var _Employee = require('../models/Employee'); var _Employee2 = _interopRequireDefault(_Employee);
var _secretsHandler = require('../secretsHandler'); var _secretsHandler2 = _interopRequireDefault(_secretsHandler);

exports. default = async (req, res, next) => {
  try {
    const getSuperAdminPermission = _secretsHandler2.default.call(void 0, 'superAdmin');
    const {
      permission, email, adminpassword, password,
    } = req.headers;

    if (!permission || !email || !adminpassword || !password) {
      throw new (0, _authErrors.Unauthorized)('Dados de autenticação não enviados');
    }

    const superAdmin = await _Employee2.default.findOne({
      where: {
        email,
        is_active: 1,
      },
    });

    if (!superAdmin) throw new (0, _clientErrors.BadRequest)('Super admin não encontrado ou inativo');

    const adminPassValidator = await superAdmin.AdminPasswordValidator(adminpassword);
    const passValidator = await superAdmin.PasswordValidator(password);

    switch (true) {
      case (superAdmin.permission !== permission):
        throw new (0, _authErrors.Unauthorized)('Acesso negado, permissao incorreta');

      case (superAdmin.permission !== getSuperAdminPermission):
        throw new (0, _authErrors.Unauthorized)('Acesso negado, permissao de super administrador necessaria');

      case (!adminPassValidator):
        throw new (0, _authErrors.Unauthorized)('Senha de admin incorreta');

      case (!passValidator):
        throw new (0, _authErrors.Unauthorized)('Senha incorreta');
    }

    return next();
  } catch (err) {
    next(err);
  }
};
