"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _authErrors = require('../errors/authErrors');
var _clientErrors = require('../errors/clientErrors');
var _Employee = require('../models/Employee'); var _Employee2 = _interopRequireDefault(_Employee);
var _secretsHandler = require('../secretsHandler'); var _secretsHandler2 = _interopRequireDefault(_secretsHandler);

// eslint-disable-next-line consistent-return
exports. default = async (req, res, next) => {
  try {
    const getAdminPermission = _secretsHandler2.default.call(void 0, 'admin');
    const getSalesPermission = _secretsHandler2.default.call(void 0, 'salesAccess');
    const getSalesOutputsPermission = _secretsHandler2.default.call(void 0, 'salesOuputsAccess');
    const getSalesOutputsInputsPermission = _secretsHandler2.default.call(void 0, 'salesOuputsInputsAccess');
    const { permission, email, adminpassword } = req.headers;
    let adminPassValidator = '';

    if (!permission || !email) {
      throw new (0, _authErrors.Unauthorized)('Permissao para vendas e id necessarios');
    }

    const employee = await _Employee2.default.findOne({
      where: {
        email,
        is_active: 1,
      },
    });

    if (!employee) {
      throw new (0, _clientErrors.BadRequest)('Funcionário não encontrado ou inativo');
    }

    if (adminpassword) {
      adminPassValidator = await employee.AdminPasswordValidator(adminpassword);
    }

    switch (true) {
      case (employee.permission === getAdminPermission
          && adminPassValidator === true
          && employee.permission === permission):
        return next();

      case (employee.permission === getSalesPermission
        && employee.permission === permission):
        return next();

      case (employee.permission === getSalesOutputsPermission
        && employee.permission === permission):
        return next();

      case (employee.permission === getSalesOutputsInputsPermission
        && employee.permission === permission):
        return next();

      default:
        throw new (0, _authErrors.Unauthorized)('Acesso negado, permissao para vendas ou de administrador necessaria');
    }
  } catch (err) {
    next(err);
  }
};
