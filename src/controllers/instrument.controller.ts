import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { Controller } from './controller.js';
import createDebug from 'debug';
import { PayloadToken } from '../services/auth.js';
import { InstrumentRepo } from '../repository/instrument.mongo.repository.js';
import { Instrument } from '../entities/instrument.js';
import { InstrumentModel } from '../repository/instrument.mongo.model.js';
const debug = createDebug('FP.I:InstrumentController');

export class InstrumentController extends Controller<Instrument> {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: InstrumentRepo, private userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      req.body.owner = userId;
      const newInstrument = await this.repo.create(req.body);
      this.userRepo.update(user.id, user);
      res.status(201);
      res.send(newInstrument);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const musicalInstrument = await InstrumentModel.findById(req.params.id);

      if (musicalInstrument && userId === musicalInstrument.owner.toString()) {
        const updatedInstrument = await InstrumentModel.findByIdAndUpdate(
          req.params.id,
          { name: req.body.get('name') },
          { new: true }
        );
        res.status(200).json(updatedInstrument);
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {

      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const musicalInstrument = await this.repo.queryById(req.params.id);
      if (musicalInstrument && userId === musicalInstrument.owner.id) {
        await this.repo.delete(req.params.id);
        res.status(201);
        res.send(musicalInstrument);
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }
}
