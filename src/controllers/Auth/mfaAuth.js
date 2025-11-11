/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import MfaSuperAdminSendEmail from '../../Notifications/MfaSuperAdminSendEmail';
import { InternalServerError } from '../../errors/serverErrors';
import Hashing from '../../hashing/hash';
import { PhraseVerify } from '../../hashing/phraseVerify';
import { phrases } from '../../hashing/phrases';
import { SequenceGenerator } from '../../hashing/stringSequenceGenerator';
import MfaList from '../../repositories/Mfa/Mfa';
import SearchMfaData from '../../repositories/Mfa/SearchMfaData';

class MfaController {
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

      const phraseIndex = phrases.indexOf(getPhrase);

      const dataForStore = {
        phrase: phraseIndex,
        sequence_hash: generateHash,
        email: verifyemail,
        is_valid: true,
      };

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

      const send = await MfaSuperAdminSendEmail.SendEmail(getPhrase);

      if (!send) throw new InternalServerError('Erro ao enviar código de acesso');
      if (send === 'Algo deu errado') throw new InternalServerError('Erro ao enviar código de acesso');

      return res.status(200).send(send);
    } catch (err) {
      next(err);
    }
  }

  async GenerateCodeUsers(req, res, next) {
    try {
      const { verifyemail } = req.headers;
      let getPhrase = '';

      // eslint-disable-next-line no-constant-condition
      while (true) {
        getPhrase = SequenceGenerator();

        // eslint-disable-next-line no-await-in-loop
        const searchPhrase = await SearchMfaData.SearchByPhrase(getPhrase);

        if (searchPhrase === null) break;
      }

      const generateHash = await Hashing.Generate(getPhrase);

      const dataForStore = {
        phrase: 0,
        sequence_hash: generateHash,
        email: verifyemail,
        is_valid: true,
      };

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

      const send = await MfaSuperAdminSendEmail.SendEmail(getPhrase);

      if (!send) throw new InternalServerError('Erro ao enviar código de acesso');
      if (send === 'Algo deu errado') throw new InternalServerError('Erro ao enviar código de acesso');

      return res.status(200).send(send);
    } catch (err) {
      next(err);
    }
  }
}

export default new MfaController();
