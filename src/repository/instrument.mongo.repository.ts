import { Instrument } from '../entities/instrument.js';
import { Repo } from './repo.js';
import { InstrumentModel } from './instrument.mongo.model.js';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';

const debug = createDebug('NB:InstrumentRepo ');

export class InstrumentRepo implements Repo<Instrument> {
  constructor() {
    debug('Instantiated', InstrumentModel);
  }

  async query(): Promise<Instrument[]> {
    const allData = await InstrumentModel.find()
      .populate('owner', { instruments: 0 })
      .exec();
    return allData;
  }

  async queryById(id: string): Promise<Instrument> {
    const result = await InstrumentModel.findById(id)
      .populate('owner', { sightings: 0 })
      .exec();
    if (result === null)
      throw new HttpError(400, 'Not found', 'No user found with this id');
    return result;
  }

  async create(data: Omit<Instrument, 'id'>): Promise<Instrument> {
    const newSighting = await InstrumentModel.create(data);
    return newSighting;
  }

  async update(id: string, data: Partial<Instrument>): Promise<Instrument> {
    const newSighting = await InstrumentModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (newSighting === null)
      throw new HttpError(404, 'Not found', 'Invalid id');
    return newSighting;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Instrument[]> {
    const result = await InstrumentModel.find({ [key]: value }).exec();
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await InstrumentModel.findByIdAndDelete(id).exec();
    if (result === null) throw new HttpError(404, 'Not found', 'Invalid id');
  }
}
