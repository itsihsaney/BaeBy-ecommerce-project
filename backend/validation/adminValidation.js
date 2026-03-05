import Joi from "joi";

/* ---------------- ADMIN LOGIN ---------------- */

export const adminLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required()
});


/* ---------------- CREATE PRODUCT ---------------- */

export const createProductSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .allow("")
    .optional(),

  image: Joi.string()
    .uri()
    .required(),

  price: Joi.number()
    .min(0)
    .required(),

  category: Joi.string()
    .min(2)
    .required()
});


/* ---------------- UPDATE PRODUCT ---------------- */

export const updateProductSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(100)
    .optional(),

  description: Joi.string()
    .allow("")
    .optional(),

  image: Joi.string()
    .uri()
    .optional(),

  price: Joi.number()
    .min(0)
    .optional(),

  category: Joi.string()
    .min(2)
    .optional()
});