import { NextFunction, Request, Response } from 'express';
import onFinished from 'on-finished';

export default function (req: Request, res: Response, next: NextFunction) {
  next();
  onFinished(res, function (error, res) {
    if (error) console.error(error);
    const err = error || res.error;
    const data = {
      ip_address: req.ip,
      client_url: req.get('referer') || null,
      server_url: req.originalUrl,
      status_code: res.statusCode,
      method: req.method,
      datetime: new Date().toISOString(),
      duration: parseFloat(res.get('x-response-time')?.replace('ms', '')),
      body: req.body,
      error: err?.message || null
    };
    console.log(data);
  });
}
