import { ErrorRequestHandler, Request, Response } from "express";

export const globalErrorHandler: ErrorRequestHandler = (err, req: Request, res: Response) => {
  const stack = err.stack;
  const message = err.message;
  const status = err.status ? err.status : 'failed';
  const statusCode = err.statusCode ? err.statusCode : 500;

  return res.status(statusCode).json({
    status,
    message,
    stack
  })
};