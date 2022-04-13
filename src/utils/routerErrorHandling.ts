import { NextApiResponse } from 'next';
import { DocErrors } from '@src/types/jsonApi';
import HttpError from '@src/utils/httpError';
import { Error as MongooseError } from 'mongoose';
import { isError } from 'joi';

export default function routerErrorHandling(
  res: NextApiResponse<DocErrors>,
  error: unknown,
) {
  const errors: DocErrors['errors'] = [];

  // Check Bedasarkan instance
  if (error instanceof HttpError) {
    errors.push({
      title: error.message,
      detail: error.detail,
      status: `${error.status}`,
    });
  } else if (error instanceof MongooseError) {
    errors.push({
      title: `Error cause by mongoose`,
      detail: error.message,
      status: `500`,
    });
  } else if (isError(error)) {
    errors.push({
      title: `Error cause by joi validation`,
      detail: error.message,
      status: `400`,
    });
  } else {
    errors.push({
      title: `Error happend when request`,
      detail: `Error happend when request`,
      status: `500`,
    });
  }

  res.status(parseInt(errors[0].status)).json({
    errors,
  });
}
