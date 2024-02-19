import { Request, Response } from "express";
import { loginService, registrationService } from '../services/auth.service';
import { loginSchema } from '../validation-schema/auth';

/**
 * ROUTE: /api/auth/registration
 * METHOD: POST
 * DESC: New user registration
 */
export const userRegistration = async (req: Request, res: Response) => {
  return await registrationService(req, res);
};

/**
 * ROUTE: /api/auth/login
 * METHOD: POST
 * DESC: User login with email and password
 */
export const userLogin = async (req: Request, res: Response) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  };

  return await loginService(req, res);
};