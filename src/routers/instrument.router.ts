import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { Repo } from '../repository/repo.js';
import { Instrument } from '../entities/instrument.js';
import { InstrumentRepo } from '../repository/instrument.mongo.repository.js';
import { InstrumentController } from '../controllers/instrument.controller.js';
import { User } from '../entities/user.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileMiddleware } from '../middleware/files.js';
const debug = createDebug('NB:InstrumentRouter');

debug('Executed');

const instrumentRepo: Repo<Instrument> = new InstrumentRepo();
const userRepo: Repo<User> = new UserRepo();
const controller = new InstrumentController(instrumentRepo, userRepo);
export const instrumentRouter = createRouter();
const auth = new AuthInterceptor(userRepo);
const fileStore = new FileMiddleware();

instrumentRouter.get('/', controller.getAll.bind(controller));
instrumentRouter.get('/:id', controller.getById.bind(controller));
instrumentRouter.post(
  '/',
  fileStore.singleFileStore('image').bind(fileStore),
  auth.logged.bind(auth),
  fileStore.optimization.bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.post.bind(controller)
);
instrumentRouter.patch(
  '/:id',
  fileStore.singleFileStore('image').bind(fileStore),

  auth.logged.bind(auth),
  auth.authorized.bind(auth),

  controller.patch.bind(controller)
);
instrumentRouter.delete(
  '/:id',
  auth.logged.bind(auth),
  auth.authorized.bind(auth),
  controller.deleteById.bind(controller)
);
