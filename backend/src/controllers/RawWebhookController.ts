import { Request, Response } from 'express';

/**
 * Handles raw webhook payloads. Expects the request to be processed with
 * `express.raw({ type: 'application/json' })` middleware so `req.body`
 * will be a Buffer containing the raw JSON string sent by Interswitch.
 * The function simply logs the raw payload and returns a 200 status with no body.
 */
export const handleRawWebhook = (req: Request, res: Response) => {
  try {
    const rawPayload = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '';
    console.log('Received raw webhook payload:', rawPayload);
    // Respond with 200 and no body as required by Interswitch.
    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing raw webhook:', error);
    // Still respond 200 to avoid retries per Interswitch spec.
    res.sendStatus(200);
  }
};
