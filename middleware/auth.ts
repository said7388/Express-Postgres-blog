import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { connection } from "../config/db.config";
import { registrationSchema } from "../validation-schema/auth.schema";

// Verify JWT token
export const verifyAuthenticUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  let tokenWithoutBearer = null;

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  if (token && token.startsWith("Bearer ")) {
    // Remove the "Bearer " keyword and extract the token
    tokenWithoutBearer = token.split(" ")[1];
  }

  jwt.verify(tokenWithoutBearer as string, process.env.JWT_SECRTE as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

// Validate request body and check if user exists.
export const validateInput = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const { error } = registrationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  };

  try {
    const sqlQuery = `SELECT * FROM Users WHERE email = '${email}';`;
    const result = await connection.query(sqlQuery);

    if (result.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists with the email!",
      });
    }
    next();
  } catch (error) {
    // console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};