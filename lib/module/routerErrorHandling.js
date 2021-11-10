import {ValidationError} from 'joi'
export default function routerErrorHandling (res, error) {
    console.log(error);

    // Jika error karena Joi
    if(error instanceof ValidationError) error.code = 400
    const code = error.code || 500;
    const title = error.title || `internal server error`;
    const detail = error.detail;

    if (detail) return res.status(code).json({errors: [{title, detail}]})

    res.status(code).json({errors: [{title}]})
}