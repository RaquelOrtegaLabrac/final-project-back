import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.mongo.repository';
import { UserController } from './user.controller';
import { AuthServices } from '../services/auth';
import { HttpError } from '../types/http.error';

jest.mock('../services/auth');
describe('Given a UserController class', () => {
  describe('When it is instantiated', () => {
    const mockRepo = {
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as unknown as UserRepo;
    const req = { body: {} } as unknown as Request;
    const res = {
      send: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    const controller = new UserController(mockRepo);

    test('Then the register method should be used', async () => {
      req.body = { userName: 'felipe', passwd: '12345' };
      await controller.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockRepo.create).toHaveBeenCalled();
    });
    test('Then the login method should be used', async () => {
      req.body = { userName: 'test', passwd: 'test' };
      await controller.login(req, res, next);

      expect(mockRepo.search).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });
  });
});

describe('Given a user controller', () => {
  const req = {
    body: { user: 'test', password: 'test' },
  } as unknown as Request;
  const res = {
    send: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  describe('When register function is called but password is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new Error('Invalid user/Password');
      const mockRepo: UserRepo = {
        search: jest.fn().mockRejectedValue(error),
        create: jest.fn().mockRejectedValue(error),
      } as unknown as UserRepo;
      const controller = new UserController(mockRepo);
      await controller.register(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('When it is instantiated and login method is called but user or password is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(400, 'Bad Request', 'Invalid user/Password');
      const mockRepo: UserRepo = {
        search: jest
          .fn()
          .mockResolvedValueOnce([{ user: 'test', password: 'test' }]),
        create: jest.fn().mockResolvedValueOnce({}),
      } as unknown as UserRepo;
      const controller = new UserController(mockRepo);
      req.body = { user: 'test', password: 'test' };

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('When it is instantiated and login method is called but userIsValid is false', () => {
    test('Then it should throw an error', async () => {
      req.body.userName = 'test';
      req.body.passwd = 'test';
      const mockRepo: UserRepo = {
        search: jest
          .fn()
          .mockResolvedValueOnce([{ user: 'test', password: 'test' }]),

        create: jest.fn().mockResolvedValueOnce({}),
      } as unknown as UserRepo;

      const controller = new UserController(mockRepo);
      (AuthServices.compare as jest.Mock).mockResolvedValueOnce(false);
      await controller.login(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then...', async () => {
      req.body.userName = 'test';
      req.body.passwd = 'test';
      const mockRepo: UserRepo = {
        search: jest
          .fn()
          .mockResolvedValueOnce([
            { userName: 'test', passwd: 'test', id: '1' },
          ]),

        create: jest.fn().mockResolvedValueOnce({}),
      } as unknown as UserRepo;

      const controller = new UserController(mockRepo);
      (AuthServices.createJWT as jest.Mock).mockReturnValue('test');
      (AuthServices.compare as jest.Mock).mockResolvedValueOnce(true);
      await controller.login(req, res, next);
      expect(res.send).toHaveBeenCalled();
    });
  });
  describe('When...', () => {
    test('Then...', async () => {
      req.body.userName = 'test';
      req.body.passwd = 'test';
      const error = new HttpError(400, 'Bad Request', 'Invalid user/Password');
      const mockRepo: UserRepo = {
        search: jest.fn().mockResolvedValue([]),
      } as unknown as UserRepo;
      const controller = new UserController(mockRepo);

      await controller.login(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
