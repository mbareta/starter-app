import { Request, Response, NextFunction } from 'express';
import * as onFinished from 'on-finished';

export default function (req: Request, res: Response, next: NextFunction) {
  next();
  onFinished(res, function (error, res) {
    if (error) console.error(error);
    const data = {
      ip_address: req.ip,
      client_url: req.get('referer') || null,
      server_url: req.originalUrl,
      status_code: res.statusCode,
      method: req.method,
      datetime: (new Date()).toISOString(),
      duration: parseFloat(res.get('x-response-time').replace('ms', '')),
      body: req.body,
      error: error?.message || null
    };
    console.log(data);
  });
}
