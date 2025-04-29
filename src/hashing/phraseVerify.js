import { phrases } from './phrases';

// eslint-disable-next-line import/prefer-default-export
export const PhraseVerify = () => {
  const randomNumber = Math.random() * (phrases.length - 1) + 1;
  const transformToInt = randomNumber.toFixed(0);

  const getPhrase = phrases[transformToInt];

  return getPhrase;
};
