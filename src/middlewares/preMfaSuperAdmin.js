/* eslint-disable camelcase */
import { Unauthorized } from '../errors/authErrors';
import Employee from '../models/Employee';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    const {
      permission, verify_email, adminpassword, password1, password2, password3,
    } = req.headers;

    if (!permission || !verify_email || !adminpassword || !password1 || !password2 || !password3) {
      // mudar esta mensagem?
      throw new Unauthorized('Dados de autenticação não enviados');
    }

    if (password1 !== process.env.PASSWORD_1 && password2
        !== process.env.PASSWORD_2 && verify_email !== process.env.CORRECT_EMAIL) {
      throw new Unauthorized('Credenciais inválidas');
    }

    const superAdmin = await Employee.findOne({
      where: {
        email: verify_email,
        is_active: 1,
      },
    });

    const passwordVerify = await superAdmin.PasswordValidator(password3);
    const adminPasswordVerify = await superAdmin.AdminPasswordValidator(adminpassword);

    // eslint-disable-next-line default-case
    switch (true) {
      case passwordVerify !== true:
        throw new Unauthorized('Credenciais inválidas');

      case adminPasswordVerify !== true:
        throw new Unauthorized('Credenciais inválidas');

      case superAdmin.dataValues.permission !== permission:
        throw new Unauthorized('Credenciais inválidas');

      case process.env.SUPER_ADMIN_PERMISSION !== permission:
        throw new Unauthorized('Credenciais inválidas');
    }

    return next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};
