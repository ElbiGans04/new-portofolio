import {ValidationError} from 'joi'
export default function routerErrorHandling (res, error) {
    console.log(error);

    // Jika error karena Joi
    if(error instanceof ValidationError) error.code = 400
    const code = error.code || 500;
    const message = error.message || `internal server error`;
    return res.status(code).json({error: {message}})
}