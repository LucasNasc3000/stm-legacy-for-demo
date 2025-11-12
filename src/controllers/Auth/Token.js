/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import Log from '../../Logs/LogRegister';
import { InternalServerError } from '../../errors/serverErrors';
import Employee from '../../models/Employee';
// import SecretsHandler from '../secretsHandler';

class TokenController {
  async Store(req, res, next) {
    try {
      // const jwtSecret = SecretsHandler('jwtSecret');
      // const jwtExpiration = SecretsHandler('jwtExpiration');
      const { email = '' } = req.body;

      // Se o erro é 500 significa que o email se perdeu entre o codeVerify e este controller
      if (!email) throw new InternalServerError('Email necessário para login');

      const employee = await Employee.findOne({ where: { email, is_active: 1 } });

      const { id } = employee.dataValues;

      const token = jwt.sign({ id, email, role: 'superadmin' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });

      await Log.createLog(id, email);

      return res.json({ token, superadmin: { nome: employee.name, id, email } });
    } catch (err) {
      next(err);
    }
  }

  async StoreUsers(req, res, next) {
    try {
      const { email = '' } = req.headers;

      // Se o erro é 500 significa que o email se perdeu entre o codeVerify e este controller
      if (!email) throw new InternalServerError('Email necessário para login');

      const employee = await Employee.findOne({ where: { email, is_active: 1 } });

      const { permission, id } = employee.dataValues;

      let role = '';

      // eslint-disable-next-line default-case
      switch (permission) {
        case process.env.ADMIN_PERMISSION:
          role = 'admin';
          break;

        case process.env.INPUTS_PERMISSION:
          role = 'inputsRoutes';
          break;

        case process.env.OUTPUTS_PERMISSION:
          role = 'outputsRoutes';
          break;

        case process.env.SALES_PERMISSION:
          role = 'salesRoutes';
          break;
      }

      const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });

      await Log.createLog(id, email);

      return res.json({ token, employee: { nome: employee.name, id, email } });
    } catch (err) {
      next(err);
    }
  }
}

export default new TokenController();
