/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import { InternalServerError } from '../errors/serverErrors';
import Hashing from '../hashing/hash';
import { phrases } from '../hashing/phrases';
import { PhraseVerify } from '../hashing/phraseVerify';
import MfaList from '../repositories/MfaSuperAdmin/MfaSuperAdmin';
import SearchMfaData from '../repositories/MfaSuperAdmin/SearchMfaData';

class MfaSuperAdminController {
  // associar um email às linhas do mfasuperadmin no BD pra usar em outras partes do código
  async GenerateCode(req, res, next) {
    try {
      const { verifyemail } = req.headers;
      let controlVar = 0;
      let getPhrase = '';

      while (controlVar < phrases.length) {
        getPhrase = PhraseVerify();

        // eslint-disable-next-line no-await-in-loop
        const searchPhrase = await SearchMfaData.SearchByPhrase(getPhrase);

        if (searchPhrase === null) break;

        // VOLTAR AQUI
        controlVar += 1;
      }

      if (controlVar === phrases.length) throw new InternalServerError('Códigos esgotados');

      const generateHash = await Hashing.Generate(getPhrase);

      const dataForStore = {
        phrase: getPhrase,
        sequence_hash: generateHash,
        email: verifyemail,
        is_valid: true,
      };

      console.log('CONTROL VAR:');
      console.log(controlVar);
      console.log('GENERATE HASH:');
      console.log(generateHash);
      console.log('GETPHRASE:');
      console.log(getPhrase);
      console.log('DATA FOR STORE:');
      console.log(dataForStore);

      const saveHash = await MfaList.Store(dataForStore);

      const { id } = saveHash.dataValues;

      setTimeout(async () => {
        const findMfaData = await SearchMfaData.SearchById(id);

        if (!findMfaData) return;

        const mfaCodeInvalidate = await MfaList.Update(id, {
          is_valid: false,
        });

        if (mfaCodeInvalidate === 'código não encontrado') throw new InternalServerError('Erro interno. Contate o suporte');
      }, 300000);

      // await MfaSuperAdminSendEmail.SendEmail(saveHash.dataValues.phrase);

      return res.status(200).send('Código enviado');
    } catch (err) {
      next(err);
    }
  }
}

export default new MfaSuperAdminController();
