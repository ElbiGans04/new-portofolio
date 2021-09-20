import joi from 'joi'

const schema = joi.object({
    title: joi.string().alphanum().max(50).required(),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    tools: joi.array().items(joi.string().required()).unique(),
    typeProject: joi.string().alphanum().max(50).required(),
    description: joi.string().max(100).required(),
    url: joi.string().alphanum().max(10).required(),
});

export default schema