import path from 'path';
import multer from 'multer';
import createDebug from 'debug';
import crypto from 'crypto';
import { HttpError } from '../types/http.error.js';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';

const debug = createDebug('NB:FileMiddleware');

export class FileMiddleware {
  constructor() {
    debug('Instantiate');
  }

  singleFileStore(fileName = 'file', fileSize = 8_000_000) {
    const upload = multer({
      storage: multer.diskStorage({
        destination: 'public/uploads',
        filename(req, file, callback) {
          const suffix = crypto.randomUUID();
          const extension = path.extname(file.originalname);
          const basename = path.basename(file.originalname, extension);
          const filename = `${basename}-${suffix}${extension}`;
          debug('Called Multer');
          callback(null, filename);
        },
      }),
      limits: {
        fileSize,
      },
    });
    const middleware = upload.single(fileName);
    return middleware;
  }

  async optimization(req: Request, _res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new HttpError(406, 'Not Acceptable', 'Not valid image file');
      }

      const fileName = req.file.filename;
      const baseFileName = `${path.basename(fileName, path.extname(fileName))}`;

      const imageData = await sharp(path.join('public/uploads', fileName))
        .webp({ quality: 100 })
        .toFile(path.join('public/uploads', `${baseFileName}_1.webp`));

      req.file.originalname = req.file.path;
      req.file.filename = `${baseFileName}.${imageData.format}`;
      req.file.mimetype = `image/${imageData.format}`;
      req.file.path = path.join('public/uploads', req.file.filename);
      req.file.size = imageData.size;

      next();
    } catch (error) {
      next(error);
    }
  }

  saveImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      debug('Called saveImage', req.file);

      if (req.file) {
        const userImage = req.file.filename;
        const aUserImage = userImage.split('.');
        const imagePath = `${req.protocol}://${req.get('host')}/uploads/${
          aUserImage[0] + '_1.' + aUserImage[1]
        }`;

        req.body[req.file.fieldname] = {
          urlOriginal: req.file.originalname,
          url: imagePath,
          mimetype: req.file.mimetype,
          size: req.file.size,
        };
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
