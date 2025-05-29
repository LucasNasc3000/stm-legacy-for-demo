"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _phrases = require('./phrases');

// eslint-disable-next-line import/prefer-default-export
 const PhraseVerify = () => {
  const randomNumber = Math.random() * (_phrases.phrases.length - 1) + 1;
  const transformToInt = randomNumber.toFixed(0);

  const getPhrase = _phrases.phrases[transformToInt];

  return getPhrase;
}; exports.PhraseVerify = PhraseVerify;
