/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import Decimal from 'decimal.js';
import { BadRequest } from '../../errors/clientErrors';
import { InternalServerError } from '../../errors/serverErrors';
import Validation from '../../middlewares/fieldValidations/Validation';
import InputMethods from '../../repositories/Input/InputHistory/Input';
import { InsertDot, ReplaceDot } from './ReplaceDot';

class InputController {
  async Store(req, res, next) {
    try {
      const validations = Validation.MainValidations(req.body);
      const inputValidations = Validation.InputsValidation(req.body);

      if (validations !== null) throw new BadRequest(validations);
      if (inputValidations !== null) throw new BadRequest(inputValidations);

      const withDots = InsertDot(req.body);

      const toAddWithDots = [
        'totalweight_per_register',
        'totalprice',
      ];

      const commaFields = [
        'weightperunit',
        'price',
      ];

      commaFields.forEach((element) => {
        if (withDots[element]) {
          const toDecimal = new Decimal(withDots[element]);
          withDots[element] = toDecimal;
        }
      });

      toAddWithDots.forEach((element) => {
        withDots[element] = 0;
        const toDecimal = new Decimal(withDots[element]);
        withDots[element] = toDecimal;
      });

      const store = await InputMethods.Store(withDots);

      if (!store) throw new InternalServerError('Erro interno');

      ReplaceDot(store);

      return res.status(200).json(store);
    } catch (err) {
      next(err);
    }
  }
}

export default new InputController();
