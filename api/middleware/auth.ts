import { NextFunction, Request, Response } from 'express';
import * as fireBaseAdmin from 'firebase-admin';

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) next();
  if (!authorization) return res.status(401).send({ message: 'Unauthorized' });
  if (!authorization.startsWith('Bearer'))
    return res.status(401).send({ message: 'Unauthorized' });

  const split = authorization.split('Bearer ');
  if (split.length !== 2)
    return res.status(401).send({ message: 'Unauthorized' });

  const token = split[1];

  if (!token) return res.status(401).send({ message: 'Unauthorized' });

  try {
    const decodedToken: fireBaseAdmin.auth.DecodedIdToken = await fireBaseAdmin
      .auth()
      .verifyIdToken(token);

    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    return next();
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
}
