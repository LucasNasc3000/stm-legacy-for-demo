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
      const { verifyemail = '' } = req.body;

      // Se o erro é 500 significa que o email se perdeu entre o codeVerify e este controller
      if (!verifyemail) throw new InternalServerError('Email necessário para login');

      const employee = await Employee.findOne({ where: { email: verifyemail, is_active: 1 } });

      const { id } = employee.dataValues;

      const token = jwt.sign({ id, email: verifyemail, role: 'superadmin' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });

      await Log.createLog(id, verifyemail);

      return res.json({ token, superadmin: { nome: employee.name, id, email: verifyemail } });
    } catch (err) {
      next(err);
    }
  }

  async StoreUsers(req, res, next) {
    try {
      const { verifyemail = '' } = req.body;

      // Se o erro é 500 significa que o verifyemail se perdeu entre o codeVerify e este controller
      if (!verifyemail) throw new InternalServerError('Email necessário para login');

      const employee = await Employee.findOne({
        where: {
          email: verifyemail,
          is_active: 1,
        },
      });

      const { permission, id } = employee.dataValues;

      let role = '';

      // eslint-disable-next-line default-case
      if (permission === process.env.ADMIN_PERMISSION) role = 'admin';
      if (permission !== process.env.ADMIN_PERMISSION) role = 'employee-nonadmin';

      const token = jwt.sign({ id, email: verifyemail, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });

      await Log.createLog(id, verifyemail);

      return res.json({ token, employee: { nome: employee.name, id, email: verifyemail } });
    } catch (err) {
      next(err);
    }
  }
}

export default new TokenController();
