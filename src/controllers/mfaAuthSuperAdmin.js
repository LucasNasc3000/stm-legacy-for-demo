/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
import Hashing from '../hashing/hash';
import { phrases } from '../hashing/phrases';
import MfaSuperAdminSendEmail from '../Notifications/MfaSuperAdminSendEmail';
import MfaList from '../repositories/MfaSuperAdmin/MfaSuperAdmin';
import SearchMfaData from '../repositories/MfaSuperAdmin/SearchMfaData';

class MfaSuperAdminController {
  // associar um email às linhas do mfasuperadmin no BD pra usar em outras partes do código
  async GenerateCode(req, res, next) {
    try {
      const { verifyEmail } = req.headers;

      const getPhrase = this.PhraseVerify();

      const searchPhrase = await SearchMfaData.SearchByPhrase(getPhrase);

      while (getPhrase === searchPhrase.dataValues.phrase) this.PhraseVerify();

      const generateHash = Hashing.Generate(getPhrase);

      const dataForStore = {
        phrase: getPhrase,
        email: verifyEmail,
        sequence_hash: generateHash,
      };

      const saveHash = await MfaList.Store(dataForStore);

      await MfaSuperAdminSendEmail.SendEmail(saveHash.dataValues.phrase);

      return res.status(200).send('Código enviado');
    } catch (err) {
      next(err);
    }
  }

  PhraseVerify() {
    const randomNumber = Math.random() * (phrases.length - 0) + 0;

    const getPhrase = phrases[randomNumber];

    return getPhrase;
  }
}

export default new MfaSuperAdminController();
