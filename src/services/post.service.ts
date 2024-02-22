import { Request, Response } from "express";
import { connection } from "../../config/db.config";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
import { queryTypes } from "../types";

// Retrieve all posts from the database
export const allPostService = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search = '' } = req.query as queryTypes;
  const skip = (Number(page) - 1) * Number(limit);
  const searchTerm = `%${search}%`;

  try {
    const query = `
      SELECT p.*, u.name AS author
      FROM posts p
      INNER JOIN Users u ON p.author_id = u.id
      WHERE title ILIKE $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3;
    `;

    const result = await connection.query(query, [searchTerm, limit, skip]);
    const posts = result.rows;
    const total = result.rowCount;

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total as number / Number(limit)),
        totalIPost: total,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again.',
    });
  }
};

// Retrieve a single post from the database by ID.
export const singlePostService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = `
    SELECT p.*, u.name AS author
    FROM posts p
    INNER JOIN Users u ON p.author_id = u.id
    WHERE p.id = $1;
    `;
    const result = await connection.query(query, [id]);
    const post = result.rows[0];

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found!"
      });
    };

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again."
    });
  };
};

// Retrieve all posts by a specific user from the database.
export const userPostsService = async (req: Request, res: Response) => {
  const user = req.user as User;
  const { page = 1, limit = 10, search = '' } = req.query as queryTypes;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    let query = `
    SELECT p.*, u.name AS author
    FROM Posts p
    INNER JOIN Users u ON p.author_id = u.id
    WHERE p.author_id = $1
    `;
    const params: any = [user.id];

    if (search) {
      query += ` AND title ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, skip);

    const result = await connection.query(query, params);
    const posts = result.rows;
    const total = result.rowCount;

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total as number / Number(limit)),
        totalIPost: total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again.',
    });
  }
};

// Create a new post in the database.
export const createPostService = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const user = req.user as User;

  try {
    const query = `INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *;`;
    const value = [title, content, user.id];
    const result = await connection.query(query, value);
    const post = result.rows[0];

    return res.status(201).json({
      success: true,
      data: post,
      message: "New post created successfully!"
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again."
    });
  }
};

// Update a post by id and only author of the post can update it.
export const updatePostService = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const user = req.user as User;

  try {
    const query = `SELECT * FROM posts WHERE id = $1;`;
    const postResult = await connection.query(query, [id]);
    const findPost: Post = postResult.rows[0];

    if (!findPost) {
      return res.status(404).json({
        success: false,
        message: "This post not found!"
      });
    } else if (findPost.author_id !== user.id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update this post!"
      });
    };

    const updateQuery = `UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *;`;
    const value = [title || findPost.title, content || findPost.content, id];
    const result = await connection.query(updateQuery, value);

    const post = result.rows[0];

    return res.status(200).json({
      success: true,
      data: post,
      message: "Post updated successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again."
    });
  };
};

// Delete a post by id and only author of the post can delete it.
export const deletePostService = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = req.user as User;

  try {
    const query = `SELECT * FROM posts WHERE id = $1;`;
    const postResult = await connection.query(query, [id]);
    const findPost: Post = postResult.rows[0];

    if (!findPost) {
      return res.status(404).json({
        success: false,
        message: "This post not found!"
      });
    } else if (findPost.author_id !== user.id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this post!"
      });
    };

    const deleteQuery = `DELETE FROM posts WHERE id = $1 RETURNING *;`;
    const result = await connection.query(deleteQuery, [id]);
    const post = result.rows[0];

    return res.status(200).json({
      success: true,
      data: post,
      message: "Post deleted successfully!"
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again."
    });
  };
};