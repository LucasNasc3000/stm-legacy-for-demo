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
      verifyemail, adminpassword, password,
    } = req.body;

    if (!verifyemail || !adminpassword || !password) {
      // mudar esta mensagem?
      throw new Unauthorized('Dados de autenticação não enviados');
    }

    const user = await Employee.findOne({
      where: {
        email: verifyemail,
        is_active: 1,
      },
    });

    const searchCodeRegister = await SearchByEmail.SearchByEmail(verifyemail);

    const passwordVerify = await user.PasswordValidator(password);
    const adminPasswordVerify = await user.AdminPasswordValidator(adminpassword);

    // eslint-disable-next-line default-case
    switch (true) {
      case user === null:
        throw new NotFound('Usuário não encontrado');

      case user.dataValues.email !== verifyemail:
        throw new Unauthorized('Credenciais inválidas');

      case passwordVerify !== true:
        throw new Unauthorized('Credenciais inválidas');

      case adminPasswordVerify !== true:
        throw new Unauthorized('Credenciais inválidas');

        // Para invalidar códigos anteriores associados ao email em "verifyemail"
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
