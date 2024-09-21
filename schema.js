const Joi = require('joi');

const listingJoiSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().uri().optional(),  // URL is optional and must be a valid URI if provided
      filename: Joi.string().optional()    // Filename is optional and must be a string if provided
    }).optional(),  // The entire image object is optional
    price: Joi.number().min(0).required(),
    category:Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});

module.exports = listingJoiSchema;
