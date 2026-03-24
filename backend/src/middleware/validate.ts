import { Response } from 'express';

export const handleValidation = (schema: any, body: any, res: Response) => {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue: any) => ({
      field: issue.path[0],
      message: issue.message
    }));
    res.status(422).json({ success: false, message: 'Validation failed', errors });
    return null;
  }
  return parsed.data;
};