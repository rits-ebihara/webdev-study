import { User } from './User';

export const fn = (name: string) => {
  const user = new User(name);
  return user.callUser();
};
