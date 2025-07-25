const joi = require('joi');
const linkSchema = require('./common/link.schema');

const postSchema = joi.object({
  date: joi.string().isoDate().required(),
  description: joi.string(),
  image: joi.string().required(),
  links: joi.array().items(linkSchema).required(),
  title: joi.string().required()
});

module.exports = postSchema;
