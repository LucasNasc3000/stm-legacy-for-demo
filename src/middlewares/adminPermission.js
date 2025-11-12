/* eslint-disable consistent-return */
/* eslint-disable default-case */
import { Unauthorized } from '../errors/authErrors';
import { BadRequest } from '../errors/clientErrors';
import Employee from '../models/Employee';
// import SecretsHandler from '../secretsHandler';

export default async (req, res, next) => {
  try {
    // const getAdminPermission = SecretsHandler('admin');
    const { employeeEmail, role } = req;

    if (!employeeEmail) throw new Unauthorized('Email necessário para login');

    const employee = await Employee.findOne({
      where: {
        email: employeeEmail,
        is_active: 1,
        permission: process.env.ADMIN_PERMISSION,
      },
    });

    if (!employee) throw new BadRequest('Administrador não encontrado ou inativo');
    if (role !== 'admin') throw new Unauthorized('Acesso negado, permissao incorreta');

    return next();
  } catch (err) {
    next(err);
  }
};
