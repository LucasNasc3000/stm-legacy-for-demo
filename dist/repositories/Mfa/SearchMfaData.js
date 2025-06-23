"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _MfaPhrase = require('../../models/MfaPhrase'); var _MfaPhrase2 = _interopRequireDefault(_MfaPhrase);

class SearchMfaData {
  async SearchById(id) {
    const findById = await _MfaPhrase2.default.findOne({
      where: {
        id,
      },
    });

    return findById;
  }

  async SearchByEmail(email) {
    const findByEmail = await _MfaPhrase2.default.findOne({
      where: {
        email,
      },
    });

    return findByEmail;
  }

  // eslint-disable-next-line consistent-return
  async SearchByPhrase(phrase) {
    try {
      const findByPhrase = await _MfaPhrase2.default.findOne({
        where: {
          phrase,
        },
      });
      console.log(findByPhrase);

      return findByPhrase;
    } catch (e) {
      console.log(e);
    }
  }
}

exports. default = new SearchMfaData();
