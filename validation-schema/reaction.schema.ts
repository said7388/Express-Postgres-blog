import Joi from "joi";

export const newReactionSchema = Joi.object({
  post_id: Joi.number().required(),
})