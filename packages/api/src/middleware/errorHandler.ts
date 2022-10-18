import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  error: any,
  request: Request,
  res: Response,
  _: NextFunction
) => {
  if (error.isBoom) {
    console.log(error);
    const { statusCode, ...payload } = error.output.payload;

    res.status(statusCode).json(
      error.data
        ? {
            error: payload.error,
            message: payload.message,
            data: error.data || null,
          }
        : { error: payload.error, message: payload.message }
    );
  } else {
    const status = error.status || 400;
    res.status(status).json({ message: error.message });
  }
};
