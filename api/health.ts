import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      status: 'ok',
      appName: 'VisaTrack AI',
      environment: 'vercel-serverless',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      time: new Date().toISOString(),
    })
  );
}
