import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import createDebug from 'debug';
import { errorHandler } from './middleware/error.js';
import { userRouter } from './routers/user.router.js';
import { instrumentRouter } from './routers/instrument.router.js';
const debug = createDebug('final-project:App');

export const app = express();

debug('Loaded Express App');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.send('Unusual instruments');
});

app.use('/user', userRouter);
app.use('/instrument', instrumentRouter);

app.use(errorHandler);
