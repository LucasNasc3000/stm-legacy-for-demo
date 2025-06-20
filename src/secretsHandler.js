import * as fs from 'fs';
import * as path from 'path';

export default function SecretsHandler(secretName) {
  try {
    const secretsDir = '/run/secrets';

    const secretsPath = path.join(secretsDir, secretName);

    return fs.readFileSync(secretsPath, 'utf-8').trim();
  } catch (err) {
    console.log('Erro de variável(s) de ambiente');
  }
}
