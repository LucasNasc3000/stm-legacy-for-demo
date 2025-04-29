/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import { InternalServerError } from '../errors/serverErrors';
import Hashing from '../hashing/hash';
import { phrases } from '../hashing/phrases';
import { PhraseVerify } from '../hashing/phraseVerify';
import MfaSuperAdminSendEmail from '../Notifications/MfaSuperAdminSendEmail';
import MfaList from '../repositories/MfaSuperAdmin/MfaSuperAdmin';
import SearchMfaData from '../repositories/MfaSuperAdmin/SearchMfaData';

class MfaSuperAdminController {
  // associar um email às linhas do mfasuperadmin no BD pra usar em outras partes do código
  async GenerateCode(req, res, next) {
    try {
      const { verify_email } = req.headers;
      let controlVar = 0;
      let getPhrase = '';

      while (controlVar < phrases.length) {
        getPhrase = PhraseVerify();

        // eslint-disable-next-line no-await-in-loop
        const searchPhrase = await SearchMfaData.SearchByPhrase(getPhrase);

        if (searchPhrase === null) break;

        controlVar += 1;
      }
      console.log(controlVar);

      if (controlVar === phrases.length) throw new InternalServerError('Códigos esgotados');

      const generateHash = await Hashing.Generate(getPhrase);

      const dataForStore = {
        phrase: getPhrase,
        sequence_hash: generateHash,
        email: verify_email,
      };

      const saveHash = await MfaList.Store(dataForStore);

      const { id } = saveHash.dataValues;

      setTimeout(async () => {
        const mfaDataDelete = await MfaList.Delete(id);
        if (mfaDataDelete === 'Algo deu errado') throw new InternalServerError('Erro interno. Contate o suporte');
      }, 600000);

      await MfaSuperAdminSendEmail.SendEmail(saveHash.dataValues.phrase);

      return res.status(200).send('Código enviado');
    } catch (err) {
      next(err);
    }
  }
}

export default new MfaSuperAdminController();
