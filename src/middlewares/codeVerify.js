/* eslint-disable camelcase */
import { Unauthorized } from '../errors/authErrors';
import { InternalServerError } from '../errors/serverErrors';
import Hashing from '../hashing/hash';
import Mfa from '../repositories/Mfa/Mfa';
import SearchByEmail from '../repositories/Mfa/SearchMfaData';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    const { verifyemail, code } = req.headers;

    if (!verifyemail || !code) throw new Unauthorized('Credenciais inválidas');

    const searchCode = await SearchByEmail.SearchByEmailAndIfIsValid(verifyemail);

    if (!searchCode) throw new Unauthorized('Credenciais inválidas');

    const { is_valid } = searchCode.dataValues;

    // eslint-disable-next-line default-case
    switch (true) {
      case !is_valid:
        throw new Unauthorized('Código expirado ou credenciais inválidas');

      case typeof is_valid === 'boolean':
        if (is_valid !== true) throw new Unauthorized('Código expirado ou credenciais inválidas');
        break;

      case typeof is_valid === 'number':
        if (is_valid !== 1) throw new Unauthorized('Código expirado ou credenciais inválidas');
        break;
    }

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
