import bcrypt from 'bcryptjs';

export default async (password) => {
  const generate = await bcrypt.hash(password, 8);
  return generate;
};
