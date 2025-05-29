"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

class Hashing {
  async Generate(charSequence) {
    const theHash = await _bcryptjs2.default.hash(charSequence, 8);
    return theHash;
  }

  async Compare(charSequence, hash) {
    const hashCompare = await _bcryptjs2.default.compare(charSequence, hash);
    return hashCompare;
  }
}

exports. default = new Hashing();
