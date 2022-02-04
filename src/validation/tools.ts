import joi from 'joi';

const schema = joi
  .object({
    type: joi.string().max(50).required(),
    id: joi.string().max(100),
    attributes: joi
      .object({
        name: joi.string().max(50).required(),
        as: joi.string().max(100).required(),
      })
      .required(),
  })
  .required();

export default schema;
