/* eslint-disable consistent-return */
import { Unauthorized } from '../errors/authErrors';
import { BadRequest } from '../errors/clientErrors';
import Employee from '../models/Employee';
// import SecretsHandler from '../secretsHandler';

export default async (req, res, next) => {
  try {
    // const getAdminPermission = SecretsHandler('admin');
    // const getInputsPermission = SecretsHandler('inputsAccess');
    // const getInputsOutputsPermission = SecretsHandler('inputsOutputsAccess');
    // const getSalesOutputsInputsPermission = SecretsHandler('salesOutputsInputsAccess');
    const { employeeEmail, employeeId, role } = req;

    if (!employeeEmail || !employeeId || !role) {
      throw new Unauthorized('Credenciais não enviadas');
    }

    const employee = await Employee.findOne({
      where: {
        id: employeeId,
        email: employeeEmail,
        is_active: 1,
        permission: process.env.INPUTS_PERMISSION,
      },
    });

    if (!employee) throw new BadRequest('Funcionário não encontrado ou inativo');

    if (role !== 'inputsRoutes') throw new Unauthorized('Acesso negado, permissao incorreta');

    if (employee.permission === process.env.ADMIN_PERMISSION && role === 'admin') return next();
  } catch (err) {
    next(err);
  }
};
