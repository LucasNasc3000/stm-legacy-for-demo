/* eslint-disable camelcase */
import { Unauthorized } from '../errors/authErrors';
import { NotFound } from '../errors/notFound';
import Employee from '../models/Employee';
import Mfa from '../repositories/Mfa/Mfa';
import SearchByEmail from '../repositories/Mfa/SearchMfaData';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    // const getSuperAdminPermission = SecretsHandler('superAdmin');
    // const getPass1 = SecretsHandler('Pass1');
    // const getPass2 = SecretsHandler('Pass2');
    // const correctEmail = SecretsHandler('correctEmail');
    const {
      permission, verifyemail, adminpassword, password1, password2, password3,
    } = req.headers;

    if (!permission || !verifyemail || !adminpassword || !password1 || !password2 || !password3) {
      // mudar esta mensagem?
      throw new Unauthorized('Dados de autenticação não enviados');
    }

    if (password1 !== process.env.PASSWORD_1 && password2
        !== process.env.PASSWORD_2 && verifyemail !== process.env.CORRECT_EMAIL) {
      throw new Unauthorized('Credenciais inválidas');
    }

    const superAdmin = await Employee.findOne({
      where: {
        email: verifyemail,
        is_active: 1,
      },
    });

    const searchCodeRegister = await SearchByEmail.SearchByEmail(verifyemail);

    const passwordVerify = await superAdmin.PasswordValidator(password3);
    const adminPasswordVerify = await superAdmin.AdminPasswordValidator(adminpassword);

    // eslint-disable-next-line default-case
    switch (true) {
      case superAdmin === null:
        throw new NotFound('Super admin não encontrado');

      case superAdmin.dataValues.email !== verifyemail:
        throw new Unauthorized('Credenciais inválidas');

      case passwordVerify !== true:
        throw new Unauthorized('Credenciais inválidas');

      case adminPasswordVerify !== true:
        throw new Unauthorized('Credenciais inválidas');

      case superAdmin.dataValues.permission !== permission:
        throw new Unauthorized('Credenciais inválidas');

      case process.env.SUPER_ADMIN_PERMISSION !== permission:
        throw new Unauthorized('Credenciais inválidas');

        // Para invalidar códigos anteriores
      case searchCodeRegister !== null:
        if (searchCodeRegister.dataValues.email === verifyemail) {
          await Mfa.Update(searchCodeRegister.dataValues.id, {
            is_valid: false,
          });
        }
        return next();
    }

    return next();
  } catch (e) {
    next(e);
  }
};
