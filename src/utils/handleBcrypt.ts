import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};
