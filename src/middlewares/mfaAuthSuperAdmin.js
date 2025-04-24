/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
import { Unauthorized } from '../errors/authErrors';
import Hashing from '../hashing/hash';
import { phrases } from '../hashing/phrases';

export default async (req, res, next) => {
  try {
    const {
      permission, email, adminpassword, password1, password2, phrase,
    } = req.headers;

    if (!permission || !email || !adminpassword || !password1 || !password2 || !phrase) {
      // mudar esta mensagem?
      throw new Unauthorized('Dados de autenticação não enviados');
    }

    if (password1 !== process.env.PASSWORD_1 && password2
       !== process.env.PASSWORD_2 && email !== process.env.CORRECT_EMAIL) {
      throw new Unauthorized('Dados de autenticação inválidos');
    }

    const randomNumber = Math.random() * (phrases.length - 0) + 0;

    const generateHash = Hashing.Generate(phrases[randomNumber]);

    // salvar o hash na base de dados
    // enviar por email a frase
  } catch (err) {
    next(err);
  }
};
