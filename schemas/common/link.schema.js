const joi = require('joi');

const linkSchema = joi.object({
  artworkDate: joi.string().allow(null, ''),
  type: joi.string().required(),
  url: joi.string().uri().required(),
});

module.exports = linkSchema;
