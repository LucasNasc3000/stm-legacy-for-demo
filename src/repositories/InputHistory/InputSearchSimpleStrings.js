import { Op } from 'sequelize';
import Input from '../../models/InputHistory';
import inputAttributes from './Attributes';

class InputSimpleStringSearch {
  async SearchByCategory(category) {
    const inputFinder = await Input.findAll({
      where: {
        category: { [Op.startsWith]: category },
      },
      attributes: inputAttributes,
      order: [['id', 'DESC']],
    });

    return inputFinder;
  }

  async SearchByNameInternal(name) {
    const inputFinder = await Input.findOne({
      where: {
        name,
      },
      attributes: inputAttributes,
      order: [['id', 'DESC']],
    });

    return inputFinder;
  }

  async SearchBySupplier(supplier) {
    const inputFinder = await Input.findAll({
      where: {
        supplier: { [Op.startsWith]: supplier },
      },
      attributes: inputAttributes,
      order: [['id', 'DESC']],
    });

    return inputFinder;
  }

  async SearchByEmployeeId(employeeId) {
    const inputFinderByEmployeeId = await Input.findAll({
      where: {
        employee_id: employeeId,
      },
      attributes: inputAttributes,
      order: [['id', 'DESC']],
    });

    return inputFinderByEmployeeId;
  }

  async SearchByReason(reason) {
    const inputFinder = await Input.findAll({
      where: {
        reason: { [Op.startsWith]: reason },
      },
      attributes: inputAttributes,
      order: [['id', 'DESC']],
    });

    return inputFinder;
  }
}

export default new InputSimpleStringSearch();
