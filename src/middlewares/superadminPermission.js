/* eslint-disable consistent-return */
/* eslint-disable default-case */
import { Unauthorized } from '../errors/authErrors';
import { BadRequest } from '../errors/clientErrors';
import Employee from '../models/Employee';

export default async (req, res, next) => {
  try {
    const {
      email, password1, password2, password3, password4,
    } = req.headers;

    if (!password1 || !password2 || !password3 || !password4 || !email) {
      throw new Unauthorized('Senhas e e-mail necessários');
    }

    const employee = await Employee.findOne({
      where: {
        email,
        is_active: 1,
      },
    });

    switch (true) {
      case !employee:
        throw new BadRequest('Funcionário não encontrado ou inativo');

      case email !== process.env.FROM_EMAIL || email !== process.env.FROM_EMAIL_2:
        throw new Unauthorized('E-mail inválido');

      case password1 !== process.env.PASSWORD_1:
        throw new Unauthorized('Senha 1 incorreta');

      case password1 !== process.env.PASSWORD_2:
        throw new Unauthorized('Senha 2 incorreta');
    }

    switch (true) {
      case (employee.permission !== permission):
        throw new Unauthorized('Acesso negado, permissao incorreta');

      case (headerid && employee.permission !== process.env.ADMIN_PERMISSION):
        return next();

      case (employee.permission !== process.env.ADMIN_PERMISSION && !headerid):
        throw new Unauthorized('Acesso negado, permissao para administrador necessaria');

      case (!adminPassValidator):
        throw new Unauthorized('Senha incorreta');
    }
    return next();
  } catch (err) {
    next(err);
  }
};
