import { Unauthorized } from '../errors/authErrors';
import { BadRequest } from '../errors/clientErrors';
import Employee from '../models/Employee';
// import SecretsHandler from '../secretsHandler';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    // const getAdminPermission = SecretsHandler('admin');
    // const getSalesPermission = SecretsHandler('salesAccess');
    // const getSalesOutputsPermission = SecretsHandler('salesOutputsAccess');
    // const getSalesOutputsInputsPermission = SecretsHandler('salesOutputsInputsAccess');
    const { permission, email, adminpassword } = req.headers;
    let adminPassValidator = '';

    if (!permission || !email) {
      throw new Unauthorized('Permissao para vendas e id necessarios');
    }

    const employee = await Employee.findOne({
      where: {
        email,
        is_active: 1,
      },
    });

    if (!employee) {
      throw new BadRequest('Funcionário não encontrado ou inativo');
    }

    if (adminpassword) {
      adminPassValidator = await employee.AdminPasswordValidator(adminpassword);
    }

    // eslint-disable-next-line default-case
    switch (true) {
      case (employee.permission === process.env.ADMIN_PERMISSION
          && adminPassValidator === true
          && employee.permission === permission):
        return next();

      case (employee.permission === process.env.SALES_PERMISSION
        && employee.permission === permission):
        return next();

      case (employee.permission === process.env.SO_PERMISSION
        && employee.permission === permission):
        return next();

      case (employee.permission === process.env.SOI_PERMISSION
        && employee.permission === permission):
        return next();
    }
  } catch (err) {
    next(err);
  }
};
