import { Request, Response } from "express";
import { connection } from "../../config/db.config";
import { User } from "../models/user.model";

// If rection exists then remove it or add a new reaction.
export const newReactionService = async (req: Request, res: Response) => {
  const user = req.user as User;
  const { post_id } = req.body;

  try {
    const findQuery = `SELECT * FROM Reactions WHERE user_id = $1 AND post_id = $2;`;
    const findResult = await connection.query(findQuery, [user.id, post_id]);
    const reaction = findResult.rows[0];
    if (reaction) {
      const deleteQuery = `DELETE FROM Reactions WHERE id = $1;`;
      await connection.query(deleteQuery, [reaction.id]);

      return res.status(200).json({
        success: true,
        reaction: false,
      });
    };

    const insertQuery = `INSERT INTO Reactions (user_id, post_id) VALUES ($1, $2);`;
    await connection.query(insertQuery, [user.id, post_id]);

    return res.status(200).json({
      success: true,
      reaction: true,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again."
    });
  }
};

// Retrieve all reactions of a post.
export const getReactionsService = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const query = `
    SELECT r.*, u.name AS user
    FROM Reactions r
    JOIN Users u ON r.user_id = u.id
    WHERE post_id = $1;
    `;
    const result = await connection.query(query, [postId]);
    const total = result.rowCount;

    return res.status(200).json({
      success: true,
      reactions: result.rows,
      totalReaction: total,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again."
    });
  }
}