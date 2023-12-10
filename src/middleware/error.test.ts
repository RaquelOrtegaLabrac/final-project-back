import { NextFunction, Request, Response } from 'express';
import { errorHandler } from './error';
import { HttpError } from '../types/http.error';
import mongoose, { mongo } from 'mongoose';
import { ValidationError } from 'express-validation';

describe('Given the errorHandler middleware', () => {
  describe('When I call the fuction', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    const mockConsoleError = jest.fn();

    beforeAll(() => {
      global.console.error = mockConsoleError;
    });

    test('Then, if it is called with a not specific Error, it should set status to 500 and call the send method with an error object', () => {
      const error = new Error('Error');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });

    test('Then, if it is called with a HttpError, it should set a status, a statusMessage and an error object', () => {
      const error = new HttpError(
        404,
        'Not found',
        'The Request was not found'
      );
      errorHandler(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    test('When it is called with a mongoose.Error.ValidationError, then it should set a status, a statusMessage and an error object', () => {
      const error = new mongoose.Error.ValidationError();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });

    test('When it is called with a mongo.MongoServerError, then it should set a status, a statusMessage and an error object', () => {
      const error = new mongo.MongoServerError({
        ErrorDescription: 'MongoDB server error',
      });
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.send).toHaveBeenCalled();
    });

    test('When it is called with a ValidationError, then it should set a status, a statusMessage and an error object', () => {
      const error = new ValidationError({}, {});
      error.statusCode = 418;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(418);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
