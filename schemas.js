const BaseJoi = require('joi')
const sanitizeHTML = require('sanitize-html')

const Joi = BaseJoi.extend((joi) => {
    return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': '{{#label}} must not include HTML'
        },
        rules: {
            escapeHTML: {
                validate(value, helpers) {
                    const clean = sanitizeHTML(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                    });
                    if (clean !== value) {
                        return helpers.error('string.escapeHTML', { value })
                    }
                    return clean
                }
            }
        }
    }
})

const projectSchema = Joi.object({
    project: Joi.object({
        name: Joi.string().required().escapeHTML(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required().escapeHTML(),
        certifiLevel: Joi.string().required().escapeHTML(),
        // image: Joi.string().required(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    imagesToDelete: Joi.array()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
})
module.exports = { projectSchema, reviewSchema }