/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import Decimal from 'decimal.js';
import { BadRequest } from '../../errors/clientErrors';
import { InternalServerError } from '../../errors/serverErrors';
import Validation from '../../middlewares/fieldValidations/Validation';
import InputMethods from '../../repositories/Input/Input';
import { InsertDot } from './ReplaceDot';

class InputController {
  async Store(req, res, next) {
    try {
      const validations = Validation.MainValidations(req.body);
      const inputValidations = Validation.InputsValidation(req.body);

      if (validations !== null) throw new BadRequest(validations);
      if (inputValidations !== null) throw new BadRequest(inputValidations);

      const withDots = InsertDot(req.body);

      const newPrice = new Decimal(withDots.price);

      withDots.price = newPrice;

      const store = await InputMethods.Store(withDots);

      if (!store) throw new InternalServerError('Erro interno');

      return res.status(200).json(store);
    } catch (err) {
      next(err);
    }
  }

  async Update(req, res, next) {
    try {
      const { id } = req.params;

      const validations = Validation.MainValidations(req.body, false, false, false, true);
      const inputValidations = Validation.InputsValidation(req.body);

      if (validations !== null) throw new BadRequest(validations);
      if (inputValidations !== null) throw new BadRequest(inputValidations);

      const { employee_id, ...allowedData } = req.body;

      const withDots = InsertDot(allowedData);

      const commaFields = [
        'totalweight',
        'weightperunit',
        'price',
      ];

      commaFields.forEach((element) => {
        if (withDots[element]) {
          const toDecimal = new Decimal(withDots[element]);
          withDots[element] = toDecimal;
        }
      });

      // Funciona sem await mas não retorna os dados na requisição caso ela seja feita com um app de
      // requisições como insomnia.
      const inputUpdate = await InputMethods.Update(id, withDots);

      if (inputUpdate === 'insumo não encontrado') throw new BadRequest('Insumo não encontrado');

      if (!inputUpdate) throw new InternalServerError('Erro interno');

      return res.status(200).send(inputUpdate);
    } catch (err) {
      next(err);
    }
  }
}

export default new InputController();
