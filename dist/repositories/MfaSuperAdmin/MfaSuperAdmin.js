"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _MfaPhrase = require('../../models/MfaPhrase'); var _MfaPhrase2 = _interopRequireDefault(_MfaPhrase);

class MfaList {
  async Store(data) {
    const mfaDataRegister = await _MfaPhrase2.default.create(data);
    return mfaDataRegister;
  }

  async Delete(id) {
    const mfaDeleteRegister = await _MfaPhrase2.default.destroy(id);
    return mfaDeleteRegister;
  }

  async Update(id, data) {
    const mfaDataUpdate = await _MfaPhrase2.default.findByPk(id);

    if (!mfaDataUpdate) return 'código não encontrado';

    const newMfaData = await mfaDataUpdate.update(data);

    return newMfaData;
  }
}

exports. default = new MfaList();
