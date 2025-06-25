/* eslint-disable camelcase */
import { Unauthorized } from '../errors/authErrors';
import { NotFound } from '../errors/notFound';
import Employee from '../models/Employee';
import Mfa from '../repositories/Mfa/Mfa';
import SearchByEmail from '../repositories/Mfa/SearchMfaData';
import SecretsHandler from '../secretsHandler';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    const getSuperAdminPermission = SecretsHandler('superAdmin');
    const getPass1 = SecretsHandler('Pass1');
    const getPass2 = SecretsHandler('Pass2');
    const correctEmail = SecretsHandler('correctEmail');
    const {
      permission, verifyemail, adminpassword, password1, password2, password3,
    } = req.headers;

    console.log(req.headers);
    console.log(!permission || !verifyemail || !adminpassword || !password1 || !password2 || !password3);

    if (!permission || !verifyemail || !adminpassword || !password1 || !password2 || !password3) {
      // mudar esta mensagem?
      throw new Unauthorized('Dados de autenticação não enviados');
    }

    if (password1 !== getPass1 && password2
        !== getPass2 && verifyemail !== correctEmail) {
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
        console.log('sw 1');
        throw new NotFound('Super admin não encontrado');

      case superAdmin.dataValues.email !== verifyemail:
        console.log('sw 2');
        throw new Unauthorized('Credenciais inválidas');

      case passwordVerify !== true:
        console.log('sw 3');
        throw new Unauthorized('Credenciais inválidas');

      case adminPasswordVerify !== true:
        console.log('sw 4');
        throw new Unauthorized('Credenciais inválidas');

      case superAdmin.dataValues.permission !== permission:
        console.log('sw 5');
        throw new Unauthorized('Credenciais inválidas');

      case getSuperAdminPermission !== permission:
        console.log('sw 6');
        throw new Unauthorized('Credenciais inválidas');

        // Para invalidar códigos anteriores
      case searchCodeRegister !== null:
        if (searchCodeRegister.dataValues.email === verifyemail) {
          await Mfa.Update(searchCodeRegister.dataValues.id, {
            is_valid: false,
          });
        }
        next();
    }

    return next();
  } catch (e) {
    next(e);
  }
};
