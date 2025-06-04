"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable camelcase */
/* eslint-disable consistent-return */
var _serverErrors = require('../errors/serverErrors');
var _hash = require('../hashing/hash'); var _hash2 = _interopRequireDefault(_hash);
var _phrases = require('../hashing/phrases');
var _phraseVerify = require('../hashing/phraseVerify');
var _MfaSuperAdminSendEmail = require('../Notifications/MfaSuperAdminSendEmail'); var _MfaSuperAdminSendEmail2 = _interopRequireDefault(_MfaSuperAdminSendEmail);
var _MfaSuperAdmin = require('../repositories/MfaSuperAdmin/MfaSuperAdmin'); var _MfaSuperAdmin2 = _interopRequireDefault(_MfaSuperAdmin);
var _SearchMfaData = require('../repositories/MfaSuperAdmin/SearchMfaData'); var _SearchMfaData2 = _interopRequireDefault(_SearchMfaData);

class MfaSuperAdminController {
  // associar um email às linhas do mfasuperadmin no BD pra usar em outras partes do código
  async GenerateCode(req, res, next) {
    try {
      const { verify_email } = req.headers;
      let controlVar = 0;
      let getPhrase = '';

      while (controlVar < _phrases.phrases.length) {
        getPhrase = _phraseVerify.PhraseVerify.call(void 0, );

        // eslint-disable-next-line no-await-in-loop
        const searchPhrase = await _SearchMfaData2.default.SearchByPhrase(getPhrase);

        if (searchPhrase === null) break;

        controlVar += 1;
      }

      if (controlVar === _phrases.phrases.length) throw new (0, _serverErrors.InternalServerError)('Códigos esgotados');

      const generateHash = await _hash2.default.Generate(getPhrase);

      const dataForStore = {
        phrase: getPhrase,
        sequence_hash: generateHash,
        email: verify_email,
      };

      const saveHash = await _MfaSuperAdmin2.default.Store(dataForStore);

      const { id } = saveHash.dataValues;

      setTimeout(async () => {
        const findMfaData = await _SearchMfaData2.default.SearchById(id);

        if (!findMfaData) return;

        const mfaDataDelete = await _MfaSuperAdmin2.default.Delete(id);

        if (mfaDataDelete === 'Algo deu errado') throw new (0, _serverErrors.InternalServerError)('Erro interno. Contate o suporte');
      }, 300000);

      await _MfaSuperAdminSendEmail2.default.SendEmail(saveHash.dataValues.phrase);

      return res.status(200).send('Código enviado');
    } catch (err) {
      next(err);
    }
  }
}

exports. default = new MfaSuperAdminController();
