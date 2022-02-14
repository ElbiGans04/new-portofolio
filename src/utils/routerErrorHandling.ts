import { NextApiResponse } from 'next';
import { DocErrors } from '@typess/jsonApi';
import HttpError from '@src/modules/httpError';
import { Error as MongooseError } from 'mongoose';

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
  } else {
    errors.push({
      title: `Error happend when request`,
      detail: `Error happend when request`,
      status: `500`,
    });
  }

  // Show
  console.log(error);

  res.status(parseInt(errors[0].code)).json({
    errors,
  });
}
