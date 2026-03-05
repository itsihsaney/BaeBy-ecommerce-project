import Joi from "joi";

/* ---------------- REGISTER ---------------- */

export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  role: Joi.string()
    .valid("user", "admin")
    .default("user") // ensures default role
});


/* ---------------- LOGIN ---------------- */

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required()
});


/* ---------------- PRODUCT ---------------- */

export const productSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .max(500)
    .optional(),

  price: Joi.number()
    .min(0)
    .required(),

  category: Joi.string()
    .min(2)
    .optional(),

  image: Joi.string()
    .uri()
    .optional()
});