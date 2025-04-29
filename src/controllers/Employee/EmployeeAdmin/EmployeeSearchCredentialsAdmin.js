/* eslint-disable consistent-return */
import { NotFound } from '../../../errors/notFound';
import { InternalServerError } from '../../../errors/serverErrors';
import EmployeesSearchCredentials from '../../../repositories/Employee/EmployeeSearchCredentials';

class EmployeesSearchCredentialsAdminController {
  async SearchByID(req, res, next) {
    try {
      const { id } = req.params;

      const employeeIDFinder = await EmployeesSearchCredentials.SearchById(id);

      if (!employeeIDFinder) throw new NotFound('Funcionário não encontrado');

      return res.status(200).json(employeeIDFinder);
    } catch (err) {
      next(err);
    }
  }

  async SearchByName(req, res, next) {
    try {
      const { name } = req.params;

      const employeeNameFinder = await EmployeesSearchCredentials.SearchByName(name);

      if (!employeeNameFinder) throw new InternalServerError('Erro interno');
      if (employeeNameFinder.length < 1) throw new NotFound('Funcionário não encontrado');

      return res.status(200).json(employeeNameFinder);
    } catch (err) {
      next(err);
    }
  }

  async SearchByEmail(req, res, next) {
    try {
      const { email } = req.params;

      const employeeEmailFinder = await EmployeesSearchCredentials.SearchByEmail(email);

      if (!employeeEmailFinder) throw new NotFound('Funcionário não encontrado');

      return res.status(200).json(employeeEmailFinder);
    } catch (err) {
      next(err);
    }
  }

  async SearchForActives(req, res, next) {
    try {
      const employeeActivesFinder = await EmployeesSearchCredentials.SearchByForActives();

      if (employeeActivesFinder.length < 1) throw new NotFound('Nenhum funcionário ativo');
      if (!employeeActivesFinder) throw new InternalServerError('Erro interno');

      return res.status(200).json(employeeActivesFinder);
    } catch (err) {
      next(err);
    }
  }
}

export default new EmployeesSearchCredentialsAdminController();
