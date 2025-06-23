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
    const getAdminPermission = SecretsHandler('admin');
    const getInputsPermission = SecretsHandler('inputsAccess');
    const getOutputsPermission = SecretsHandler('outputsAccess');
    const getSalesPermission = SecretsHandler('salesAccess');
    const getSalesOutputsPermission = SecretsHandler('salesOutputsAccess');
    const getInputsOutputsPermission = SecretsHandler('inputsOutputsAccess');
    const getSalesOutputsInputsPermission = SecretsHandler('salesOutputsInputsAccess');
    const {
      permission, email, adminpassword,
    } = req.headers;

    if (!permission || !email || !adminpassword) throw new Unauthorized('Dados de autenticação não enviados');

    const userVerify = await Employee.findOne({
      where: {
        email,
        is_active: 1,
        permission,
      },
    });

    const searchCodeRegister = await SearchByEmail.SearchByEmail(email);
    const adminPasswordVerify = await userVerify.AdminPasswordValidator(adminpassword);

    if (permission !== getAdminPermission
        && permission !== getInputsPermission
        && permission !== getOutputsPermission
        && permission !== getSalesPermission
        && permission !== getInputsOutputsPermission
        && permission !== getSalesOutputsPermission
        && permission !== getSalesOutputsInputsPermission) {
      throw new Unauthorized('Permissão inválida');
    }

    // eslint-disable-next-line default-case
    switch (true) {
      case userVerify === null:
        throw new NotFound('Usuário não encontrado');

      case adminPasswordVerify !== true:
        throw new Unauthorized('Credenciais inválidas');

        // Para invalidar códigos anteriores
      case searchCodeRegister !== null:
        if (searchCodeRegister.dataValues.email === email) {
          await Mfa.Update(searchCodeRegister.dataValues.id, {
            is_valid: false,
          });
        }
        next();
    }

    return next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};
