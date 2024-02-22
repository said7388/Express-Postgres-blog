import { Request, Response } from "express";
import { connection } from "../../config/db.config";
import { User } from "../models/user.model";
import { queryTypes } from "../types";

// Get all comments for a post.
export const postCommentsService = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const { page = 1, limit = 10 } = req.query as queryTypes;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    let query =
      `SELECT c.*, u.name AS author
       FROM Comments c
       INNER JOIN Users u ON c.author_id = u.id
       WHERE post_id = $1 
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3;
     `;
    const params: any = [postId, limit, skip];

    const result = await connection.query(query, params);
    const posts = result.rows;
    const total = result.rowCount;

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total as number / Number(limit)),
        total: total,
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again.',
    });
  }
};

// Add a new comment to the post.
export const newCommentService = async (req: Request, res: Response) => {
  const { content, post_id } = req.body;
  const user = req.user as User;

  try {
    const findQuery = `SELECT * FROM Posts WHERE id = $1;`;
    const findResult = await connection.query(findQuery, [post_id]);
    const findPost = findResult.rows[0];

    if (!findPost) {
      return res.status(404).json({
        success: false,
        message: 'This post not found!',
      });
    };

    const query = `INSERT INTO Comments (post_id, content, author_id) VALUES ($1, $2, $3) RETURNING *`;
    const params = [post_id, content, user.id];
    const result = await connection.query(query, params);
    const post = result.rows[0];

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again.',
    });
  }
}

// Update a comment content by comment id and only the author of the comment can update it. 
export const updateCommentService = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = req.user as User;
  const { content } = req.body;

  try {
    const findQuery = `SELECT * FROM Comments WHERE id = $1;`;
    const findResult = await connection.query(findQuery, [id]);
    const findComment = findResult.rows[0];

    if (!findComment) {
      return res.status(404).json({
        success: false,
        message: 'This comment not found!',
      });
    } else if (findComment.author_id !== user.id) {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to update this comment!',
      });
    };

    const query = `UPDATE Comments SET content = $1 WHERE id = $2 RETURNING *`;
    const params = [content, id];

    const result = await connection.query(query, params);
    const post = result.rows[0];

    return res.status(200).json({
      success: true,
      data: post,
      message: "Comment updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again.',
    });
  }
};

// Delete a comment by comment id and only the author of the comment can delete it. 
export const deleteCommentService = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = req.user as User;

  try {
    const findQuery = `SELECT * FROM Comments WHERE id = $1;`;
    const findResult = await connection.query(findQuery, [id]);
    const findComment = findResult.rows[0];

    if (!findComment) {
      return res.status(404).json({
        success: false,
        message: 'This comment not found!',
      });
    } else if (findComment.author_id !== user.id) {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to delete this comment!',
      });
    };

    const query = `DELETE FROM Comments WHERE id = $1 RETURNING *`;
    const params = [id];

    const result = await connection.query(query, params);
    const post = result.rows[0];

    return res.status(200).json({
      success: true,
      data: post,
      message: "Comment deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again.',
    });
  };
};