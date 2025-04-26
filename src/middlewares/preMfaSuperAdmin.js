import { Unauthorized } from '../errors/authErrors';
import Employee from '../models/Employee';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    const {
      permission, email, adminpassword, password1, password2, password3,
    } = req.headers;

    if (!permission || !email || !adminpassword || !password1 || !password2) {
    // mudar esta mensagem?
      throw new Unauthorized('Dados de autenticação não enviados');
    }

    if (password1 !== process.env.PASSWORD_1 && password2
        !== process.env.PASSWORD_2 && email !== process.env.CORRECT_EMAIL) {
      throw new Unauthorized('Credenciais inválidas');
    }

    const superAdmin = await Employee.findOne({
      where: {
        email,
        is_active: 1,
      },
    });

    const passwordVerify = await superAdmin.PasswordValidator(password3);
    const adminPasswordVerify = await superAdmin.AdminPasswordValidator(adminpassword);

    // eslint-disable-next-line default-case
    switch (true) {
      case passwordVerify !== true:
        throw new Unauthorized('Senha incorreta');

      case adminPasswordVerify !== true:
        throw new Unauthorized('Senha de administrador inválida');
    }

    return next();
  } catch (e) {
    next(e);
  }
};
