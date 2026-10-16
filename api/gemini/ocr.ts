import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI, Type } from '@google/genai';

async function parseBody(req: IncomingMessage): Promise<any> {
  if ((req as any).body) {
    return (req as any).body;
  }
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body: any = {};
  try {
    body = await parseBody(req);
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
    return;
  }

  const { imageBase64 } = body;

  if (!imageBase64) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'imageBase64 is required' }));
    return;
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64,
                },
              },
              {
                text: 'Extract the machine-readable passport data from this passport data page image. Return JSON with the extracted fields: surname, givenNames, passportNumber, nationality, dateOfBirth (YYYY-MM-DD), expiryDate (YYYY-MM-DD), issueDate (YYYY-MM-DD), sex (M/F/X). If any field cannot be determined, provide a blank string.',
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              surname: { type: Type.STRING },
              givenNames: { type: Type.STRING },
              passportNumber: { type: Type.STRING },
              nationality: { type: Type.STRING },
              dateOfBirth: { type: Type.STRING },
              expiryDate: { type: Type.STRING },
              issueDate: { type: Type.STRING },
              sex: { type: Type.STRING },
              confidence: { type: Type.STRING },
            },
            required: ['surname', 'givenNames', 'passportNumber', 'nationality', 'expiryDate'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: true,
          data: parsed,
          isDemoMode: false,
          source: 'gemini-3.8-flash-ocr',
        })
      );
      return;
    } catch (err: any) {
      console.warn('Vercel Gemini OCR failed, falling back to simulated extraction:', err);
    }
  }

  // Fallback demo extraction
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      success: true,
      data: {
        surname: 'ADEBAYO',
        givenNames: 'AMAKA SIMISOLA',
        passportNumber: 'A09876543',
        nationality: 'NIGERIAN',
        dateOfBirth: '1992-06-18',
        expiryDate: '2031-06-17',
        issueDate: '2021-06-18',
        sex: 'F',
        confidence: 'High (Sandbox extraction)',
      },
      isDemoMode: true,
      notice: 'Placeholder extraction: Gemini API is unconfigured in Vercel or returned sandbox data. Verify and confirm all fields before saving.',
    })
  );
}
