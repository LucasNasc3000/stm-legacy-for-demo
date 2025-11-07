import { phrases } from './phrases';

// eslint-disable-next-line import/prefer-default-export
export const PhraseVerify = () => {
  const randomNumber = Math.random() * (phrases.length - 1);
  const fixed = randomNumber.toFixed(0);
  const toNumber = Number(fixed);

  const getPhrase = phrases[toNumber];

  return getPhrase;
};
