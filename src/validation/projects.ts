import joi from 'joi';

const ProjectSchemaValidation = joi
  .object({
    type: joi.string().max(50).required(),
    id: joi.string().max(100),
    attributes: joi
      .object({
        title: joi.string().max(50).required(),
        startDate: joi.date().required(),
        endDate: joi.date().required(),
        tools: joi
          .alternatives()
          .try(
            joi.array().items(joi.string().required()).unique().min(2),
            joi.string().required(),
          ),
        typeProject: joi.string().alphanum().max(50).required(),
        description: joi.string().max(200).required(),
        url: joi.string().max(50).required(),
        images: joi
          .array()
          .items(
            joi.object({
              src: joi.string().max(500).required(),
              ref: joi.string().max(100).required(),
            }),
          )
          .min(1)
          .required(),
      })
      .required()
      .required(),
  })
  .required();

export default ProjectSchemaValidation;
