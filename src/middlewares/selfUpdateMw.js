/* eslint-disable consistent-return */
/* eslint-disable default-case */
import { Unauthorized } from '../errors/authErrors';
import { BadRequest } from '../errors/clientErrors';
import { InternalServerError } from '../errors/serverErrors';
import Employee from '../models/Employee';
// import SecretsHandler from '../secretsHandler';

export default async (req, res, next) => {
  try {
    // const getAdminPermission = SecretsHandler('admin');
    const { employeeEmail, role, employeeId } = req;

    if (!employeeEmail || !role || !employeeId) throw new InternalServerError('Dados de permissão não enviados');

    const employee = await Employee.findOne({
      where: {
        email: employeeEmail,
        is_active: 1,
      },
    });

    if (!employee) throw new BadRequest('Funcionário não encontrado ou inativo');
    if (role !== 'employee-nonadmin') throw new Unauthorized('Acesso negado, permissao incorreta');

    return next();
  } catch (err) {
    next(err);
  }
};
