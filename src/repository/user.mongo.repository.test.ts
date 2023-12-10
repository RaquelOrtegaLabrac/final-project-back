import { User } from '../entities/user.js';
import { HttpError } from '../types/http.error.js';
import { UserModel } from './user.mongo.model.js';
import { UserRepo } from './user.mongo.repository.js';

jest.mock('./user.mongo.model');
describe('Given the UserRepo class', () => {
  const repo = new UserRepo();
  describe('When it has been instantiated', () => {
    test('Then the query method should be used', async () => {
      const mockData = [{}];
      const exec = jest.fn().mockResolvedValueOnce(mockData);
      UserModel.find = jest.fn().mockReturnValueOnce({ exec });

      const result = await repo.query();

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('Then the queryById method should be used', async () => {
      const mockId = '1';
      const mockUser = {
        id: '1',
      } as User;
      const exec = jest.fn().mockResolvedValueOnce(mockUser);
      UserModel.findById = jest.fn().mockReturnValueOnce({ exec });

      const result = await repo.queryById(mockId);

      expect(UserModel.findById).toHaveBeenCalledWith(mockId);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('Then the search method should be used', async () => {
      const mockUsers = [{ id: '1', userName: 'Ernestina' }];
      const exec = jest.fn().mockResolvedValueOnce(mockUsers);
      UserModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.search({ key: 'userName', value: 'Ernestina' });

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    test('Then the create method should be used', async () => {
      const mockUser = {
        id: 1,
        userName: 'Ernestina',
        passwd: '',
      };

      UserModel.create = jest.fn().mockReturnValueOnce(mockUser);
      const result = await repo.create(mockUser);
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('Then the update method should be used', async () => {
      const mockId = '1';
      const mockUser = { id: '1', userName: 'Ernestina' };
      const updatedUser = { id: '1', userName: 'Pepe' };
      const exec = jest.fn().mockResolvedValueOnce(updatedUser);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.update(mockId, mockUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    test('Then the delete method should be used', async () => {
      const mockId = '1';
      const exec = jest.fn();
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await repo.delete(mockId);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and queryById method is called but id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new UserRepo();
      const mockId = '';
      const error = new HttpError(404, 'Not found', 'Invalid Id');
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findById = jest.fn().mockReturnValueOnce({ exec });
      await expect(repo.queryById(mockId)).rejects.toThrow(error);
    });
  });
  describe('When it is instantiated and update method is called but id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new UserRepo();
      const mockId = '';
      const mockUser = {} as Partial<User>;
      const error = new HttpError(404, 'Not Found', 'Invalid Id');
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({ exec });
      await expect(repo.update(mockId, mockUser)).rejects.toThrow(error);
    });
  });
  describe('When it is instantiated and delete method is called but id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new UserRepo();
      const mockId = '';
      const error = new HttpError(404, 'Not Found', 'Invalid Id');
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({ exec });
      await expect(repo.delete(mockId)).rejects.toThrow(error);
    });
  });
});
