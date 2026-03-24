import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { registerSchema } from '../validations/authValidator';


export const register = async (req: Request, res: Response) => {
    try {
      // Validate request body
      const parsed = registerSchema.safeParse(req.body)
      if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
          field: issue.path[0],
          message: issue.message
        }))

        return res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors
        })
      }

      const { name, email, password } = parsed.data

      // Register user
      const result = await AuthService.register({
        name: name,
        email: email,
        password: password,
      } as any);

      const { user, token } = result;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          token
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      throw error
    }
  };

export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      if (!result) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const { user, token } = result;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: user,
          token
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      throw error
    }
  };

export const getProfile = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      return res.json({
        success: true,
        data: {
          user: user
        }
      });

    } catch (error) {
      console.error('Profile error:', error);
      throw error
    }
  };

/**
 * Logout user
 */
export const logout = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};
