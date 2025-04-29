/* eslint-disable consistent-return */
import { BadRequest } from '../../../errors/clientErrors';
import { Conflict } from '../../../errors/conflict';
import { NotFound } from '../../../errors/notFound';
import { InternalServerError } from '../../../errors/serverErrors';
import Validation from '../../../middlewares/fieldValidations/Validation';
import Employees from '../../../repositories/Employee/Employee';
import EmployeeSearch from '../../../repositories/Employee/EmployeeSearchCredentials';

class EmployeeAdminController {
  async Store(req, res, next) {
    try {
      if (req.body.boss !== null) throw new BadRequest('Cadastro somente de admins');

      const validations = Validation.MainValidations(req.body, true);
      const employeesValidations = Validation.EmployeeValidation(req.body, false, false);

      if (validations !== null) throw new BadRequest(validations);
      if (employeesValidations !== null) throw new BadRequest(employeesValidations);

      const emailExists = await EmployeeSearch.SearchByEmail(req.body.email);

      if (emailExists) throw new Conflict('E-mail em uso. Cadastre outro');

      const employeeStore = await Employees.Store(req.body);

      const { password, adminpassword, ...allowedData } = employeeStore.dataValues;

      if (!employeeStore) throw new InternalServerError('Erro interno');

      return res.status(201).json(allowedData);
    } catch (err) {
      next(err);
    }
  }

  async Update(req, res, next) {
    try {
      const { id } = req.params;

      const validations = Validation.MainValidations(req.body, true, false, false, true);
      const usersValidations = Validation.EmployeeValidation(req.body, false, true);

      if (validations !== null) throw new BadRequest(validations);
      if (usersValidations !== null) throw new BadRequest(usersValidations);

      if (req.body.email) {
        const emailExists = await EmployeeSearch.SearchByEmail(req.body.email);
        if (emailExists) throw new Conflict('E-mail em uso');
      }

      const employeeUpdate = await Employees.Update(id, req.body);

      if (employeeUpdate === 'funcionário não encontrado') throw new NotFound('Funcionário não registrado');
      if (!employeeUpdate) throw new InternalServerError('Erro interno');

      const empSearch = await EmployeeSearch.SearchById(id);

      return res.status(200).send(empSearch);
    } catch (err) {
      next(err);
    }
  }
}

export default new EmployeeAdminController();
