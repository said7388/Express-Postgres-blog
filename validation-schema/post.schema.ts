import Joi from "joi";

export const createPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export const updatePostSchema = Joi.object({
  title: Joi.optional(),
  content: Joi.optional(),
});