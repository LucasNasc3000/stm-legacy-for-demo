"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _secretsHandler = require('../secretsHandler'); var _secretsHandler2 = _interopRequireDefault(_secretsHandler);

const phrase1 = _secretsHandler2.default.call(void 0, 'Phrase1');
const phrase2 = _secretsHandler2.default.call(void 0, 'Phrase2');
const phrase3 = _secretsHandler2.default.call(void 0, 'Phrase3');
const phrase4 = _secretsHandler2.default.call(void 0, 'Phrase4');
const phrase5 = _secretsHandler2.default.call(void 0, 'Phrase5');
const phrase6 = _secretsHandler2.default.call(void 0, 'Phrase6');
const phrase7 = _secretsHandler2.default.call(void 0, 'Phrase7');

// eslint-disable-next-line import/prefer-default-export
 const phrases = [
  phrase1,
  phrase2,
  phrase3,
  phrase4,
  phrase5,
  phrase6,
  phrase7,
]; exports.phrases = phrases;
