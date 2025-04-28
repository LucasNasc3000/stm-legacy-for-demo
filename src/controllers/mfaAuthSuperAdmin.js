/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
import { PhraseVerify } from '../hashing/phraseVerify';
import SearchMfaData from '../repositories/MfaSuperAdmin/SearchMfaData';

class MfaSuperAdminController {
  // associar um email às linhas do mfasuperadmin no BD pra usar em outras partes do código
  async GenerateCode(req, res, next) {
    try {
      const { verify_email } = req.headers;

      const getPhrase = PhraseVerify();

      const searchPhrase = await SearchMfaData.SearchByPhrase(getPhrase);

      while (getPhrase !== searchPhrase.dataValues.phrase) {

      }

      console.log(searchPhrase);

      // const generateHash = Hashing.Generate(getPhrase);

      // const dataForStore = {
      //   phrase: getPhrase,
      //   email: verify_email,
      //   sequence_hash: generateHash,
      // };

      // const saveHash = await MfaList.Store(dataForStore);

      // await MfaSuperAdminSendEmail.SendEmail(saveHash.dataValues.phrase);

      return res.status(200).send('Código enviado');
    } catch (err) {
      next(err);
    }
  }
}

export default new MfaSuperAdminController();
