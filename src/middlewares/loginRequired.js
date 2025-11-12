// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import { Unauthorized } from '../errors/authErrors';
import Employee from '../models/Employee';
// import SecretsHandler from '../secretsHandler';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  // const jwtSecret = SecretsHandler('jwtSecret');
  // Das linhas 8 a 16 ocorre uma verificação da existência ou não do campo authorization no
  // cabeçalho da requisição
  const { authorization } = req.headers;

  if (!authorization) throw new Unauthorized('Login é necessário para esta operação');

  const [, token] = authorization.split(' ');

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    const { email, id, role } = dados;

    // Checa se o id e o email são os mesmos que foram usados para gerar o token
    const employee = await Employee.findOne({
      where: {
        id,
        email,
        is_active: 1,
      },
    });

    // Este erro quer dizer que o usuário que mudou seu próprio email precisa
    // logar denovo porque o email não vai bater com o token
    if (!employee) throw new Unauthorized('Funcionário inválido');

    req.employeeId = id;
    req.employeeEmail = email;
    req.role = role;
    return next();
  } catch (err) {
    next(err);
  }
};
