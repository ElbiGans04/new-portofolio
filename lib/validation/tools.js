import joi from 'joi'

const schema = joi.object({
    name: joi.string().alphanum().max(50).required(),
    as: joi.string().alphanum().max(10).required(),
});

export default schema