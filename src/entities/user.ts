import joi from 'joi';

export type User = {
  id: string;
  userName: string;
  passwd: string;
};

export type UserLogin = {
  userName: string;
  passwd: string;
};

export const userSchema = joi.object<User>({
  userName: joi.string().required(),

  passwd: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required(),
});
