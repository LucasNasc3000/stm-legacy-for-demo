/* eslint-disable camelcase */
import { Unauthorized } from '../errors/authErrors';
import { NotFound } from '../errors/notFound';
import Employee from '../models/Employee';
import MfaSuperAdmin from '../repositories/MfaSuperAdmin/MfaSuperAdmin';
import SearchByEmail from '../repositories/MfaSuperAdmin/SearchMfaData';
import SecretsHandler from '../secretsHandler';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    const getSuperAdminPermission = SecretsHandler('superAdmin');
    const getPass1 = SecretsHandler('Pass1');
    const getPass2 = SecretsHandler('Pass2');
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

    const searchCodeRegister = await SearchByEmail.SearchByEmail(verify_email);

    const passwordVerify = await superAdmin.PasswordValidator(password3);
    const adminPasswordVerify = await superAdmin.AdminPasswordValidator(adminpassword);

    // eslint-disable-next-line default-case
    switch (true) {
      case superAdmin === null:
        throw new NotFound('Super admin não encontrado');

      case superAdmin.dataValues.email !== verify_email:
        throw new Unauthorized('Credenciais inválidas');

      case passwordVerify !== true:
        throw new Unauthorized('Credenciais inválidas');

      case adminPasswordVerify !== true:
        throw new Unauthorized('Credenciais inválidas');

      case superAdmin.dataValues.permission !== permission:
        throw new Unauthorized('Credenciais inválidas');

      case getSuperAdminPermission !== permission:
        throw new Unauthorized('Credenciais inválidas');

        // Para invalidar códigos anteriores
      case searchCodeRegister !== null:
        if (searchCodeRegister.dataValues.email === verify_email) {
          await MfaSuperAdmin.Delete(searchCodeRegister.dataValues.id);
        }
    }

    return next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};
