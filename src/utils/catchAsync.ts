import { Request, Response, NextFunction, RequestHandler } from 'express';

// const catchAsync = (
//   fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
// ): RequestHandler => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };
// };

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
