/* eslint-disable camelcase */
import { Unauthorized } from '../errors/authErrors';
import { InternalServerError } from '../errors/serverErrors';
import Hashing from '../hashing/hash';
import MfaSuperAdmin from '../repositories/MfaSuperAdmin/MfaSuperAdmin';
import SearchByEmail from '../repositories/MfaSuperAdmin/SearchMfaData';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    const { verifyEmail, code } = req.headers;

    if (!verifyEmail || !code) throw new Unauthorized('Login é necessário para esta operação');

    const searchByEmailMfa = await SearchByEmail.Search(verifyEmail);

    if (!searchByEmailMfa) throw new Unauthorized('Credenciais inválidas');

    // verificar se a frase já foi usada mas não aqui, onde o hash é gerado
    const { sequence_hash } = searchByEmailMfa.dataValues;

    const hashCompare = await Hashing.Compare(code, sequence_hash);

    if (hashCompare !== true) throw new Unauthorized('Código inválido');

    const deleteMfaData = await MfaSuperAdmin.Delete(searchByEmailMfa.dataValues.id);

    // Colocar o addressesAllowed e testar

    if (deleteMfaData === 'Algo deu errado') throw new InternalServerError('Erro desconhecido ao tentar logar com mfa');

    next();
  } catch (e) {
    next(e);
  }
};
