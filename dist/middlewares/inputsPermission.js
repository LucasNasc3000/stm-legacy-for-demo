"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable consistent-return */
var _authErrors = require('../errors/authErrors');
var _clientErrors = require('../errors/clientErrors');
var _Employee = require('../models/Employee'); var _Employee2 = _interopRequireDefault(_Employee);
var _secretsHandler = require('../secretsHandler'); var _secretsHandler2 = _interopRequireDefault(_secretsHandler);

exports. default = async (req, res, next) => {
  try {
    const getAdminPermission = _secretsHandler2.default.call(void 0, 'admin');
    const getInputsPermission = _secretsHandler2.default.call(void 0, 'inputsAccess');
    const getInputsOutputsPermission = _secretsHandler2.default.call(void 0, 'inputsOutputsAccess');
    const getSalesOutputsInputsPermission = _secretsHandler2.default.call(void 0, 'salesOutputsInputsAccess');
    const { permission, email, adminpassword } = req.headers;
    let adminPassValidator = false;

    if (!permission || !email) {
      throw new (0, _authErrors.Unauthorized)('Permissao para insumos e id necessarios');
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

    // eslint-disable-next-line default-case
    switch (true) {
      case (employee.permission === getAdminPermission
        && adminPassValidator === true
        && employee.permission === permission):
        return next();

      case (employee.permission === getInputsPermission
          && employee.permission === permission):
        return next();

      case (employee.permission === getInputsOutputsPermission
          && employee.permission === permission):
        return next();

      case (employee.permission === getSalesOutputsInputsPermission
          && employee.permission === permission):
        return next();
    }
  } catch (err) {
    next(err);
  }
};
