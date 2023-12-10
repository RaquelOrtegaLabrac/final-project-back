import { Instrument } from '../entities/instrument.js';
import { User } from '../entities/user.js';
import { HttpError } from '../types/http.error.js';
import { InstrumentModel } from './instrument.mongo.model.js';
import { InstrumentRepo } from './instrument.mongo.repository.js';
import { Image } from '../types/image.js';

jest.mock('./instrument.mongo.model');

describe('Given the InstrumentRepo class', () => {
  const repo = new InstrumentRepo();
  describe('When it has been instantiated', () => {
    test('Then the query method should be used', async () => {
      const mockData = [{}];
      const exec = jest.fn().mockResolvedValueOnce(mockData);

      InstrumentModel.find = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          exec,
        }),
      });

      const result = await repo.query();
      expect(InstrumentModel.find).toHaveBeenCalled();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('Then the queryById method should be used', async () => {
      const mockSample = { id: '1' };
      const exec = jest.fn().mockResolvedValue(mockSample);
      InstrumentModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      const result = await repo.queryById('1');
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockSample);
    });

    test('Then the create method should be used', async () => {
      const mockInstrument = {
        title: 'test',
        year: 1234,
        region: 'Asia',
        description: 'qwertyuiop',
        image: {} as Image,
        owner: {} as User,
      } as unknown as Instrument;

      InstrumentModel.create = jest.fn().mockReturnValueOnce(mockInstrument);
      const result = await repo.create(mockInstrument);
      expect(InstrumentModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockInstrument);
    });

    test('Then the update method should be used', async () => {
      const mockId = '1';
      const mockInstrument = { id: '1', title: 'test' };
      const updatedInstrument = { id: '1', title: 'test2' };
      const exec = jest.fn().mockResolvedValueOnce(updatedInstrument);
      InstrumentModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.update(mockId, mockInstrument);
      expect(InstrumentModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedInstrument);
    });

    test('Then the search method should be used', async () => {
      const mockInstrument = [{ id: '1', title: 'test' }];

      const exec = jest.fn().mockResolvedValueOnce(mockInstrument);
      InstrumentModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.search({ key: 'title', value: 'test' });
      expect(InstrumentModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockInstrument);
    });

    test('Then the delete method should be used', async () => {
      const mockId = '1';
      const exec = jest.fn();
      InstrumentModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await repo.delete(mockId);
      expect(InstrumentModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and queryById method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new InstrumentRepo();
      const error = new HttpError(
        404,
        'Not found',
        'No user found with this id'
      );
      const mockId = '1';

      const exec = jest.fn().mockResolvedValue(null);

      InstrumentModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          exec,
        }),
      });

      await expect(repo.queryById(mockId)).rejects.toThrowError(error);
      expect(InstrumentModel.findById).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and update method is called but the new user equals to null', () => {
    test('Then it should throw an error', async () => {
      const repo = new InstrumentRepo();
      const error = new HttpError(404, 'Not found', 'Invalid id');
      const mockId = '1';
      const mockInstrument = {} as Partial<Instrument>;

      const exec = jest.fn().mockResolvedValue(null);
      InstrumentModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });

      await expect(repo.update(mockId, mockInstrument)).rejects.toThrowError(
        error
      );
      expect(InstrumentModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and delete method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new InstrumentRepo();
      const error = new HttpError(404, 'Not found', 'Invalid id');
      const mockId = '1';
      const exec = jest.fn().mockResolvedValueOnce(null);
      InstrumentModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await expect(repo.delete(mockId)).rejects.toThrowError(error);
      expect(InstrumentModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
