import { Op } from 'sequelize';
import Output from '../../models/Output';
import outputAttributes from './Attributes';

class OutputSimpleStringSearch {
  async SearchByType(type) {
    const outputFinder = await Output.findAll({
      where: {
        type: { [Op.startsWith]: type },
      },
      attributes: outputAttributes,
      order: [['id', 'DESC']],
    });

    return outputFinder;
  }

  async SearchByName(name) {
    const outputFinder = await Output.findAll({
      where: {
        name: { [Op.startsWith]: name },
      },
      attributes: outputAttributes,
      order: [['id', 'DESC']],
    });

    return outputFinder;
  }

  async SearchByEmployeeId(employeeId) {
    const outputFinderByEmployeeId = await Output.findAll({
      where: {
        employee_id: employeeId,
      },
      attributes: outputAttributes,
    });

    return outputFinderByEmployeeId;
  }

  async SearchByReason(reason) {
    const inputFinder = await Output.findAll({
      where: {
        reason: { [Op.startsWith]: reason },
      },
      attributes: outputAttributes,
      order: [['id', 'DESC']],
    });

    return inputFinder;
  }
}

export default new OutputSimpleStringSearch();
