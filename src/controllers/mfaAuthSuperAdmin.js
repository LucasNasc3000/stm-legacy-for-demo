/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
import Hashing from '../hashing/hash';
import { phrases } from '../hashing/phrases';
import MfaSuperAdminSendEmail from '../Notifications/MfaSuperAdminSendEmail';
import MfaList from '../repositories/MfaSuperAdmin/MfaSuperAdmin';

class MfaSuperAdminController {
  // associar um email às linhas do mfasuperadmin no BD pra usar em outras partes do código
  async GenerateCode(req, res, next) {
    try {
      const randomNumber = Math.random() * (phrases.length - 0) + 0;

      const getPhrase = phrases[randomNumber];

      const generateHash = Hashing.Generate(getPhrase);

      const dataForStore = {
        phrase: getPhrase,
        sequence_hash: generateHash,
      };

      const saveHash = await MfaList.Store(dataForStore);

      await MfaSuperAdminSendEmail.SendEmail(saveHash.dataValues.phrase);

      return res.status(200).send('Código enviado');
    } catch (err) {
      next(err);
    }
  }
}

export default new MfaSuperAdminController();
