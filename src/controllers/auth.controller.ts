import { Request, Response } from "express";
import { confirmEmailLinkService, forgotPasswordService, loginService, registrationService } from '../services/auth.service';
import { forgotPasswordSchema, loginSchema } from '../validation-schema/auth.schema';

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

/**
 * ROUTE: /api/auth/forgot-password
 * METHOD: POST
 * DESC: User forgot password request
 */
export const userForgotPassword = async (req: Request, res: Response) => {
  const { error } = forgotPasswordSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  };

  return forgotPasswordService(req, res);
};


/**
 * ROUTE: /api/auth/confirm/:id
 * METHOD: GET
 * DESC: Confirm user email verification link
 */
export const confirmEmailLink = async (req: Request, res: Response) => {
  return confirmEmailLinkService(req, res);
};