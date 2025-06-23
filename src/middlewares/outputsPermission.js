/* eslint-disable consistent-return */
import { Unauthorized } from '../errors/authErrors';
import { BadRequest } from '../errors/clientErrors';
import Employee from '../models/Employee';
import SecretsHandler from '../secretsHandler';

export default async (req, res, next) => {
  try {
    const getAdminPermission = SecretsHandler('admin');
    const getOutputsPermission = SecretsHandler('outputsAccess');
    const getSalesOutputsPermission = SecretsHandler('salesOutputsAccess');
    const getInputsOutputsPermission = SecretsHandler('inputsOutputsAccess');
    const getsalesOutputsInputsPermission = SecretsHandler('salesInputsOutputsAccess');
    const { permission, email, adminpassword } = req.headers;
    let adminPassValidator = '';

    if (!permission || !email) {
      throw new Unauthorized('Permissao para saidas e id necessarios');
    }

    const employee = await Employee.findOne({
      where: {
        email,
        is_active: 1,
      },
    });

    if (!employee) {
      throw new BadRequest('Funcionário não encontrado ou inativo');
    }

    if (adminpassword) {
      adminPassValidator = await employee.AdminPasswordValidator(adminpassword);
    }

    // eslint-disable-next-line default-case
    switch (true) {
      case (employee.permission !== permission):
        throw new Unauthorized('Acesso negado, permissao para saidas necessaria');

      case (employee.permission === getAdminPermission
        && adminPassValidator === true
        && employee.permission === permission):
        return next();

      case (employee.permission === getOutputsPermission
        && employee.permission === permission):
        return next();

      case (employee.permission === getInputsOutputsPermission
        && employee.permission === permission):
        return next();

      case (employee.permission === getSalesOutputsPermission
        && employee.permission === permission):
        return next();

      case (employee.permission === getsalesOutputsInputsPermission
        && employee.permission === permission):
        return next();
    }
  } catch (err) {
    next(err);
  }
};
