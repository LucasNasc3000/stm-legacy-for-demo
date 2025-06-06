/* eslint-disable camelcase */
import { Unauthorized } from '../errors/authErrors';
import { InternalServerError } from '../errors/serverErrors';
import Hashing from '../hashing/hash';
import MfaSuperAdmin from '../repositories/MfaSuperAdmin/MfaSuperAdmin';
import SearchByEmail from '../repositories/MfaSuperAdmin/SearchMfaData';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    const { verifyemail, code } = req.headers;

    if (!verifyemail || !code) throw new Unauthorized('Credenciais inválidas');

    const searchByEmailMfa = await SearchByEmail.SearchByEmail(verifyemail);

    if (!searchByEmailMfa) throw new Unauthorized('Código expirado ou credenciais inválidas');

    const { sequence_hash } = searchByEmailMfa.dataValues;

    const hashCompare = await Hashing.Compare(code, sequence_hash);

    if (hashCompare !== true) throw new Unauthorized('Código inválido');

    const invalidateMfaData = await MfaSuperAdmin.Update(searchByEmailMfa.dataValues.id, {
      is_valid: false,
    });

    if (invalidateMfaData === 'código não encontrado') throw new InternalServerError('Erro desconhecido ao tentar logar');

    next();
  } catch (e) {
    next(e);
  }
};
