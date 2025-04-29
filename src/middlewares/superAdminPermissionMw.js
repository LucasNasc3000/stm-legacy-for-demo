/* eslint-disable consistent-return */
/* eslint-disable default-case */
import { Unauthorized } from '../errors/authErrors';
import { BadRequest } from '../errors/clientErrors';
import Employee from '../models/Employee';

export default async (req, res, next) => {
  try {
    const {
      permission, email, adminpassword, password,
    } = req.headers;

    if (!permission || !email || !adminpassword || !password) {
      throw new Unauthorized('Dados de autenticação não enviados');
    }

    const superAdmin = await Employee.findOne({
      where: {
        email,
        is_active: 1,
      },
    });

    if (!superAdmin) throw new BadRequest('Super admin não encontrado ou inativo');

    const adminPassValidator = await superAdmin.AdminPasswordValidator(adminpassword);
    const passValidator = await superAdmin.PasswordValidator(adminpassword);

    switch (true) {
      case (superAdmin.permission !== permission):
        throw new Unauthorized('Acesso negado, permissao incorreta');

      case (superAdmin.permission !== process.env.SUPER_ADMIN_PERMISSION):
        throw new Unauthorized('Acesso negado, permissao de super administrador necessaria');

      case (!adminPassValidator):
        throw new Unauthorized('Senha de admin incorreta');

      case (!passValidator):
        throw new Unauthorized('Senha incorreta');
    }

    return next();
  } catch (err) {
    next(err);
  }
};
