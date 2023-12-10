import { Image } from '../types/image';
import { User } from './user';

export type Instrument = {
  id: string;
  name: string;
  inventor: string;
  developed: string;
  classification:
    | 'aerophones'
    | 'chordophones'
    | 'membranophones'
    | 'idiophones'
    | 'electrophones'
    | 'other';
  shortDescription: string;
  image: Image;
  video: string;
  owner: User;
};
