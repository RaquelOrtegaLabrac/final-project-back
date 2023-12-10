import { Schema, model } from 'mongoose';
import { Instrument } from '../entities/instrument';

const instrumentSchema = new Schema<Instrument>({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  inventor: {
    type: String,
    required: false,
    unique: false,
  },
  developed: {
    type: String,
    required: false,
    unique: false,
  },
  classification: {
    type: String,
    required: true,
    unique: false,
  },
  shortDescription: {
    type: String,
    required: false,
    unique: false,
  },
  image: {
    type: {
      urlOriginal: { type: String },
      url: { type: String },
      mimetype: {
        type: String,
      },
      size: { type: Number },
    },
    required: false,
  },
  video: {
    type: String,
    required: false,
    unique: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

instrumentSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.owner;
  },
});

export const InstrumentModel = model(
  'Instrument',
  instrumentSchema,
  'instruments'
);
