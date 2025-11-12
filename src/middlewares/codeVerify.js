/* eslint-disable camelcase */
import { Unauthorized } from '../errors/authErrors';
import { InternalServerError } from '../errors/serverErrors';
import Hashing from '../hashing/hash';
import Mfa from '../repositories/Mfa/Mfa';
import SearchByEmail from '../repositories/Mfa/SearchMfaData';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    const { verifyemail, code } = req.body;

    if (!verifyemail || !code) throw new Unauthorized('Credenciais inválidas');

    const searchCode = await SearchByEmail.SearchByEmailAndIfIsValid(verifyemail);

    if (!searchCode) throw new Unauthorized('Código expirado ou credenciais inválidas');

    const { sequence_hash } = searchCode.dataValues;

    const hashCompare = await Hashing.Compare(code, sequence_hash);

    if (hashCompare !== true) throw new Unauthorized('Código inválido');

    const invalidateMfaData = await Mfa.Update(searchCode.dataValues.id, {
      is_valid: false,
    });

    if (invalidateMfaData === 'código não encontrado') throw new InternalServerError('Erro desconhecido ao tentar logar');

    next();
  } catch (e) {
    next(e);
  }
};
