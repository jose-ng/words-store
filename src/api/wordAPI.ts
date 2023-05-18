import { Request, Response } from 'express';
import Word from './modelsDB/word';
import connectMongo from './utils/connectMongo';
import { allowCreate } from './utils/misc';
import * as express from 'express';

export class WordAPI {
  api(app: express.Express): void {
    // Create Word
    app.route('/api/word').post(async (req: Request, res: Response) => {
      try {
        if (!allowCreate(req.body.code)) {
          res.status(403).json({ error: 'forbbiden' });
          return;
        }

        await connectMongo();
        const newWord = req.body;
        delete newWord.code;
        const word = await Word.create(newWord);

        res.status(201).json({ word });
      } catch (err) {
        res.status(400).json({ error: 'Internal server error' });
      }
    });

    // Get All Words
    app.route('/api/word').get(async (req: Request, res: Response) => {
      try {
        await connectMongo();
        const { query } = req;
        const { q, skip, limit } = query;

        let params = {};
        if (q)
          params = {
            $or: [
              { text_en: { $regex: q, $options: 'i' } },
              { text_es: { $regex: q, $options: 'i' } },
            ],
          };
        const words = await Word.find(params)
          .skip((skip as unknown as number) * (limit as unknown as number))
          .limit(limit as unknown as number)
          .sort({ rating: 'desc' })
          .exec();
        const totalWords = await Word.count(params).exec();
        res.status(200).json({ words, totalWords });
      } catch (err) {
        res.status(400).json({ error: err });
      }
    });

    // // Get Single Word
    // app
    //   .route('/api/word/:id')
    //   .get((req: Request, res: Response, next: NextFunction) => {
    //     const id: any = req.params['id'];
    //     Word.findById(id, (error: any, data: any) => {
    //       if (error) {
    //         return next(error);
    //       } else {
    //         res.json(data);
    //       }
    //     });
    //   });

    // // Update Word
    // app
    //   .route('/api/update/:id')
    //   .put((req: Request, res: Response, next: NextFunction) => {
    //     Word.findByIdAndUpdate(
    //       req.params['id'],
    //       {
    //         $set: req.body,
    //       },
    //       (error: any, data: any) => {
    //         if (error) {
    //           return next(error);
    //         } else {
    //           res.json(data);
    //           console.log('Data updated successfully');
    //         }
    //       }
    //     );
    //   });

    // // Delete Word
    // app
    //   .route('/api/delete/:id')
    //   .delete((req: Request, res: Response, next: NextFunction) => {
    //     const id: any = req.params['id'];
    //     Word.findOneAndRemove(id, (error: any, data: any) => {
    //       if (error) {
    //         return next(error);
    //       } else {
    //         res.status(200).json({
    //           msg: data,
    //         });
    //       }
    //     });
    //   });
  }
}