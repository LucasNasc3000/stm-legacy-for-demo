import bcrypt from 'bcryptjs';

export default async (password, hashString) => {
  const generate = await bcrypt.compare(password, hashString);
  return generate;
};
