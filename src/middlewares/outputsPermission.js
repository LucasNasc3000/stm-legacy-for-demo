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
      },
    });

    // eslint-disable-next-line default-case
    switch (true) {
      case !employee:
        throw new BadRequest('Funcionário não encontrado ou inativo');

      case role !== 'employee-nonadmin':
        throw new Unauthorized('Acesso negado, permissao incorreta');

      case employee.dataValues.permission.includes(process.env.OUTPUTS_PERMISSION):
        return next();

      case employee.permission === process.env.ADMIN_PERMISSION && role === 'admin':
        return next();
    }
  } catch (err) {
    next(err);
  }
};
