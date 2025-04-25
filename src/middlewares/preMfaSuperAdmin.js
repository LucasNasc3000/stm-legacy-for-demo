import { Unauthorized } from '../errors/authErrors';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  try {
    const {
      permission, email, adminpassword, password1, password2,
    } = req.headers;

    if (!permission || !email || !adminpassword || !password1 || !password2) {
    // mudar esta mensagem?
      throw new Unauthorized('Dados de autenticação não enviados');
    }

    if (password1 !== process.env.PASSWORD_1 && password2
         !== process.env.PASSWORD_2 && email !== process.env.CORRECT_EMAIL) {
      throw new Unauthorized('Dados de autenticação inválidos');
    }

    return next();
  } catch (e) {
    next(e);
  }
};
