import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Changez `any` par le type de votre payload JWT si vous avez un type spécifique
    }
  }
}
