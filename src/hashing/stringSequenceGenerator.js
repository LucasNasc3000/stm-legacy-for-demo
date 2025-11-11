/* eslint-disable no-plusplus */
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
  'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const specialCharacters = ['!', '@', '#', '$', '%', '*', '¢', '£', '¬', '¨', '°', ';', '|', '~', '^'];

const RandomNumbers = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// eslint-disable-next-line import/prefer-default-export
export const SequenceGenerator = () => {
  const getLetters = [];
  const getSpecialCharacters = [];
  const lettersAndSCFinal = [];
  const toUpperCase = [];

  for (let i = 0; i < letters.length - 1; i++) {
    const randomNumber = RandomNumbers(0, letters.length - 1);
    getLetters.push(letters[randomNumber]);
  }

  for (let i = 0; i < letters.length - 1; i++) {
    const randomNumber = RandomNumbers(0, letters.length - 1);
    toUpperCase.push(letters[randomNumber].toUpperCase());
  }

  for (let i = 0; i < specialCharacters.length - 1; i++) {
    const randomNumber = RandomNumbers(0, specialCharacters.length - 1);
    getSpecialCharacters.push(specialCharacters[randomNumber]);
  }

  const lettersAndSC = getLetters.concat(getSpecialCharacters).concat(toUpperCase);

  for (let i = 0; i < 16; i++) {
    const randomNumber = RandomNumbers(0, 54);
    lettersAndSCFinal.push(lettersAndSC[randomNumber]);
  }

  return lettersAndSCFinal.join('');
};
