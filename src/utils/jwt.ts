import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IAuthPayload } from '../types';

export const generateToken = (payload: IAuthPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const verifyToken = (token: string): IAuthPayload => {
  return jwt.verify(token, config.jwt.secret) as IAuthPayload;
};
