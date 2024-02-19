import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { connection } from "../config/db.config";

// Register a new user with secure password.
export const registrationService = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  let hashedPassword = await bcrypt.hash(password, 10);

  try {
    const text = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *'
    const values = [name, email, hashedPassword];
    const result = await connection.query(text, values);
    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRTE as string, { expiresIn: "24h" });

    return res.status(201).json({
      success: true,
      message: "User registration successfully!",
      user: user,
      token: token
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again."
    });
  }
};

// Login a user with email and password.
export const loginService = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const sqlQuery = `SELECT * FROM Users WHERE email=$1;`;
    const result = await connection.query(sqlQuery, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist or invalid email!",
      });
    };

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password!",
      });
    };

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRTE as string, { expiresIn: "24h" });

    return res.status(200).json({
      success: true,
      message: "User login successfully!",
      token: token,
      user: user
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};