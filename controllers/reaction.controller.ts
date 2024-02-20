import { Request, Response } from "express";
import { getReactionsService, newReactionService } from "../services/reaction.service";
import { newReactionSchema } from "../validation-schema/reaction.schema";

/**
 * ROUTE: /api/reactions
 * METHOD: PUT
 * DESC: Add or Remove a reaction in a post.
 */
export const newReaction = async (req: Request, res: Response) => {
  const { error } = newReactionSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  };

  return await newReactionService(req, res);
};

/**
 * ROUTE: /api/reactions/:postId
 * METHOD: GET
 * DESC: Retrieve all reactions in a post.
 */
export const getReactions = async (req: Request, res: Response) => {
  return await getReactionsService(req, res);
};