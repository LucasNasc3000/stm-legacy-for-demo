"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _MfaPhrase = require('../../models/MfaPhrase'); var _MfaPhrase2 = _interopRequireDefault(_MfaPhrase);

class MfaList {
  async Store(data) {
    const mfaDataRegister = await _MfaPhrase2.default.create(data);
    return mfaDataRegister;
  }

  async Delete(id) {
    const mfaDataDelete = await _MfaPhrase2.default.destroy({
      where: {
        id,
      },
    });

    if (!mfaDataDelete) return 'Algo deu errado';

    return mfaDataDelete;
  }
}

exports. default = new MfaList();
