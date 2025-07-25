const joi = require('joi');

const linkSchema = joi.object({
  type: joi.string().required(),
  url: joi.string().uri().required(),
});

module.exports = linkSchema;
