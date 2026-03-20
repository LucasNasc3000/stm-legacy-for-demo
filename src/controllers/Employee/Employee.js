/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import { BadRequest } from '../../errors/clientErrors';
import { Conflict } from '../../errors/conflict';
import { Forbidden } from '../../errors/forbidden';
import { NotFound } from '../../errors/notFound';
import { InternalServerError } from '../../errors/serverErrors';
import Validation from '../../middlewares/fieldValidations/Validation';
import Employees from '../../repositories/Employee/Employee';
import EmployeeSearch from '../../repositories/Employee/EmployeeSearchCredentials';
import { ReturnAllowedData } from './utils/ReturnAllowedDataEmployeeSelfUpdate';

class EmployeeController {
  async Store(req, res, next) {
    try {
      const { headerid } = req.headers;
      const { email } = req.headers;

      if (headerid) throw new Forbidden('Ação não autorizada para funcionários');

      if (!req.body.boss) throw new Forbidden('Ação não autorizada');

      const bossId = await EmployeeSearch.SearchByEmail(email);

      if (bossId.dataValues.id !== req.body.boss) throw new Forbidden('Ação não autorizada. Somente os próprios funcionários podem ser cadastrados pelo gerente');

      const validations = Validation.MainValidations(req.body, true);
      const employeesValidations = Validation.EmployeeValidation(req.body, false, false);

      if (validations !== null) throw new BadRequest(validations);
      if (employeesValidations !== null) throw new BadRequest(employeesValidations);

      const emailExists = await EmployeeSearch.SearchByEmail(req.body.email);

      if (emailExists) throw new Conflict('E-mail em uso, cadastre outro');

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
      const { employeeid } = req.params;
      const toUpdateData = {};

      const validations = Validation.MainValidations(req.body, true, false, false, true);
      const usersValidations = Validation.EmployeeValidation(req.body, false, true);

      if (validations !== null) throw new BadRequest(validations);
      if (usersValidations !== null) throw new BadRequest(usersValidations);

      if (req.body.boss && req.body.boss === null) throw new Forbidden('Ação não permitida');

      if (req.body.email) {
        const emailExists = await EmployeeSearch.SearchByEmail(req.body.email);
        if (emailExists) throw new Conflict('E-mail em uso');
      }

      if (req.role === 'employee-nonadmin') {
        const {
          id, name, email, password, adminpassword, ...allowedData
        } = req.body;
        Object.assign(toUpdateData, allowedData);
      }

      if (req.body.boss && req.body.boss === null) throw new Forbidden('Ação não permitida');

      const {
        id, boss, is_active, ...allowedData
      } = req.body;

      Object.assign(toUpdateData, allowedData);

      const employeeUpdate = await Employees.Update(employeeid, toUpdateData);

      if (employeeUpdate === 'funcionário não encontrado') throw new NotFound('Funcionário não registrado');
      if (!employeeUpdate) throw new InternalServerError('Erro interno');

      const employeeUpdated = employeeUpdate.dataValues;

      const allowedDataUpdated = ReturnAllowedData(employeeUpdated);

      return res.status(200).send(allowedDataUpdated);
    } catch (err) {
      next(err);
    }
  }

  async UpdateSelf(req, res, next) {
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

      if (req.employeeId !== id) throw new Forbidden('Ação não autorizada');

      const {
        is_active, boss, permission, address_allowed, ...allowedDataForUpdate
      } = req.body;

      const employeeSelfUpdate = await Employees.Update(id, allowedDataForUpdate);

      if (employeeSelfUpdate === 'funcionário não encontrado') throw new NotFound('Funcionário não registrado');
      if (!employeeSelfUpdate) throw new InternalServerError('Erro interno');

      const employeeUpdated = employeeSelfUpdate.dataValues;

      const allowedData = ReturnAllowedData(employeeUpdated);

      return res.status(200).send(allowedData);
    } catch (err) {
      next(err);
    }
  }
}

export default new EmployeeController();
