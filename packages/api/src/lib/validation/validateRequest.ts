import { Request } from 'express';
import { AnyZodObject, z, ZodError } from 'zod';
import { badRequest, Boom } from '@hapi/boom';

export function validateRequest<T extends AnyZodObject>(
  schema: T,
  req: Request
): z.infer<T> {
  try {
    return schema.parse(req);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error.issues);
      throw new Boom('Bad Request', {
        statusCode: 400,
        data: error.issues,
      });
    }

    throw badRequest(JSON.stringify(error));
  }
}
