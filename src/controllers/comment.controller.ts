import { Request, Response } from "express";
import { deleteCommentService, newCommentService, postCommentsService, updateCommentService } from "../services/comment.service";
import { createCommentSchema, updateCommentSchema } from "../validation-schema/comment.schema";

/**
 * ROUTE: /api/comments/:postId
 * METHOD: GET
 * DESC: Get all comments for a post
 */
export const getPostComments = async (req: Request, res: Response) => {
  return postCommentsService(req, res);
};

/**
 * ROUTE: /api/comments/create
 * METHOD: POST
 * DESC: Add new comment to a post
 */
export const createPostComment = async (req: Request, res: Response) => {
  const { error } = createCommentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  };

  return newCommentService(req, res);
};

/**
 * ROUTE: /api/comments/update/:id
 * METHOD: PUT
 * DESC: Update comment content by id
 */
export const updatePostComment = async (req: Request, res: Response) => {
  const { error } = updateCommentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  };

  return updateCommentService(req, res);
};

/**
 * ROUTE: /api/comments/delete/:id
 * METHOD: DELETE
 * DESC: Delete a comment by id
 */
export const deletePostComment = async (req: Request, res: Response) => {

  return deleteCommentService(req, res);
};