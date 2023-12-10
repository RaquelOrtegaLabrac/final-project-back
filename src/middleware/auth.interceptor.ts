/* eslint-disable no-useless-constructor */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { AuthServices } from '../services/auth.js';

export class AuthInterceptor {
  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: UserRepo) {}

  logged(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        throw new HttpError(401, 'Not Authorized', 'Not Authorization header');
      }

      if (!authHeader.startsWith('Bearer')) {
        throw new HttpError(
          401,
          'Not Authorized',
          'Not Bearer in Authorization header'
        );
      }

      const token = authHeader.slice(7);
      const payload = AuthServices.verifyJWTGettingPayload(token);

      req.body.tokenPayload = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  async authorized(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.tokenPayload) {
        throw new HttpError(
          498,
          'Token not found',
          'Token not found in Authorized interceptor'
        );
      }

      if (req.body.tokenPayload.id === req.params.id) {
        const errorMessage = `Invalid Token or id.`;
        throw new HttpError(498, errorMessage);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
