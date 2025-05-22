/* eslint-disable camelcase */
import { Unauthorized } from '../errors/authErrors';
import Employee from '../models/Employee';
import SecretsHandler from '../secretsHandler';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    const getSuperAdminPermission = SecretsHandler('superAdmin');
    const getPass1 = SecretsHandler('pass1');
    const getPass2 = SecretsHandler('pass2');
    const correctEmail = SecretsHandler('correctEmail');
    const {
      permission, verify_email, adminpassword, password1, password2, password3,
    } = req.headers;

    if (!permission || !verify_email || !adminpassword || !password1 || !password2 || !password3) {
      // mudar esta mensagem?
      throw new Unauthorized('Dados de autenticação não enviados');
    }

    if (password1 !== getPass1 && password2
        !== getPass2 && verify_email !== correctEmail) {
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

      case getSuperAdminPermission !== permission:
        throw new Unauthorized('Credenciais inválidas');
    }

    return next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};
