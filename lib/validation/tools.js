import joi from 'joi'

const schema = joi.object({
    name: joi.string().max(50).required(),
    as: joi.string().max(10).required(),
});

export default schema