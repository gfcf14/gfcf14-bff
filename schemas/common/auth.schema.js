const joi = require('joi');

const authSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

module.exports = authSchema;
