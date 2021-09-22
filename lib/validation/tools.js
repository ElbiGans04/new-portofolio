import joi from 'joi'

const schema = joi.object({
    name: joi.string().max(50).required(),
    as: joi.string().max(100).required(),
});

export default schema