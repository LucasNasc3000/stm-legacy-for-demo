import { Op } from 'sequelize';
import Employee from '../../models/Employee';
import SecretsHandler from '../../secretsHandler';
import employeeAttributes from './Attributes';

class EmployeesSearchCredentials {
  async SearchById(id) {
    const employeeFinder = await Employee.findOne({
      where: {
        id,
      },
      attributes: employeeAttributes,
    });

    return employeeFinder;
  }

  async SearchByName(name) {
    const employeeFinderByName = await Employee.findAll({
      where: {
        name: { [Op.startsWith]: name },
      },
      attributes: employeeAttributes,
      order: [['id', 'DESC']],
    });

    return employeeFinderByName;
  }

  async SearchOneByName(name) {
    const employeeFinderByName = await Employee.findOne({
      where: {
        name,
      },
      attributes: employeeAttributes,
    });

    return employeeFinderByName;
  }

  async SearchByEmail(email) {
    const employeeFinderByEmail = await Employee.findOne({
      where: {
        email,
      },
      attributes: employeeAttributes,
    });

    return employeeFinderByEmail;
  }

  async SearchByAddressAllowed() {
    const addressAllowed = SecretsHandler('addressAllowed');
    const employeeFinderByAddressAllowed = await Employee.findAll({
      where: {
        address_allowed: addressAllowed,
        is_active: 1,
      },
      attributes: employeeAttributes,
    });

    return employeeFinderByAddressAllowed;
  }

  async SearchByForActives() {
    const employeeFinderActives = await Employee.findAll({
      where: {
        is_active: 1,
      },
      attributes: employeeAttributes,
    });

    return employeeFinderActives;
  }
}

export default new EmployeesSearchCredentials();
