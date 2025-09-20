import { Op } from 'sequelize';
import Input from '../../../models/InputHistory';
import inputAttributes from './Attributes';

class InputFloatsSearch {
  async SearchByTotalWeightPerRegister(totalWeightPerRegister) {
    const inputFinder = await Input.findAll({
      where: {
        totalweight_per_register: totalWeightPerRegister,
      },
      attributes: inputAttributes,
      order: [['id', 'DESC']],
    });

    return inputFinder;
  }

  async SearchByWeightPerUnit(weightperunit) {
    const inputFinder = await Input.findAll({
      where: {
        weightperunit,
      },
      attributes: inputAttributes,
      order: [['id', 'DESC']],
    });

    return inputFinder;
  }

  async SearchByPrice(price) {
    const inputsFinderByPrice = await Input.findAll({
      where: {
        price: { [Op.startsWith]: price },
      },
      attributes: inputAttributes,
      order: [['id', 'DESC']],
    });

    return inputsFinderByPrice;
  }

  async SearchByTotalPrice(totalprice) {
    const inputsFinderByTotalPrice = await Input.findAll({
      where: {
        totalprice: { [Op.startsWith]: totalprice },
      },
      attributes: inputAttributes,
      order: [['id', 'DESC']],
    });

    return inputsFinderByTotalPrice;
  }
}

export default new InputFloatsSearch();
