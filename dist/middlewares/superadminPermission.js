"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable consistent-return */
/* eslint-disable default-case */
var _authErrors = require('../errors/authErrors');
var _clientErrors = require('../errors/clientErrors');
var _Employee = require('../models/Employee'); var _Employee2 = _interopRequireDefault(_Employee);

exports. default = async (req, res, next) => {
  try {
    const {
      email, password1, password2, password3, password4,
    } = req.headers;

    if (!password1 || !password2 || !password3 || !password4 || !email) {
      throw new (0, _authErrors.Unauthorized)('Senhas e e-mail necessários');
    }

    const employee = await _Employee2.default.findOne({
      where: {
        email,
        is_active: 1,
      },
    });

    switch (true) {
      case !employee:
        throw new (0, _clientErrors.BadRequest)('Funcionário não encontrado ou inativo');

      case email !== process.env.FROM_EMAIL || email !== process.env.FROM_EMAIL_2:
        throw new (0, _authErrors.Unauthorized)('E-mail inválido');

      case password1 !== process.env.PASSWORD_1:
        throw new (0, _authErrors.Unauthorized)('Senha 1 incorreta');

      case password1 !== process.env.PASSWORD_2:
        throw new (0, _authErrors.Unauthorized)('Senha 2 incorreta');
    }

    switch (true) {
      case (employee.permission !== permission):
        throw new (0, _authErrors.Unauthorized)('Acesso negado, permissao incorreta');

      case (headerid && employee.permission !== process.env.ADMIN_PERMISSION):
        return next();

      case (employee.permission !== process.env.ADMIN_PERMISSION && !headerid):
        throw new (0, _authErrors.Unauthorized)('Acesso negado, permissao para administrador necessaria');

      case (!adminPassValidator):
        throw new (0, _authErrors.Unauthorized)('Senha incorreta');
    }
    return next();
  } catch (err) {
    next(err);
  }
};
