import Joi from "joi";

export const createCommentSchema = Joi.object({
  post_id: Joi.number().required(),
  content: Joi.string().required(),
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().required(),
});