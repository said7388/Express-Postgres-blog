import { Request, Response } from "express";
import { allPostService, createPostService, deletePostService, singlePostService, updatePostService, userPostsService } from "../services/post.service";
import { createPostSchema, updatePostSchema } from "../validation-schema/post.schema";

/**
 * ROUTE: /api/posts
 * METHOD: GET
 * DESC: Get all posts
 */
export const getAllPost = async (req: Request, res: Response) => {
  return allPostService(req, res);
};

/**
 * ROUTE: /api/posts/:id
 * METHOD: GET
 * DESC: Get a single post by id
 */
export const getSinglePost = async (req: Request, res: Response) => {
  return singlePostService(req, res);
};

/**
 * ROUTE: /api/posts/me
 * METHOD: GET
 * DESC: Get all posts for a user
 */
export const getUserAllPost = async (req: Request, res: Response) => {
  return userPostsService(req, res);
};

/**
 * ROUTE: /api/posts/create
 * METHOD: POST
 * DESC: Create a new post
 */
export const createPost = async (req: Request, res: Response) => {
  const { error } = createPostSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  };

  return createPostService(req, res);
};

/**
 * ROUTE: /api/posts/update/:id
 * METHOD: PUT
 * DESC: Update post data by id
 */
export const updatePost = async (req: Request, res: Response) => {
  const { error } = updatePostSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  };

  return updatePostService(req, res);
};

/**
 * ROUTE: /api/posts/delete/:id
 * METHOD: DELETE
 * DESC: Delete a post data by id
 */
export const deletePost = async (req: Request, res: Response) => {
  return deletePostService(req, res);
};