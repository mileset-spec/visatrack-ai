import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI if key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'VisaTrack AI',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// AI Chat assistant endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, history, context } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  // System instruction specifically geared towards Nigerian and international travelers
  const systemInstruction = `You are VisaTrack AI, a knowledgeable, empathetic, and professional visa preparation assistant for international travelers, specializing in assisting Nigerian citizens and residents applying for visas to Canada, the United Kingdom, and the Schengen Area (France, Germany, Italy, Netherlands, etc.).

Key Behavioral Guidelines:
1. Provide accurate, practical, and highly organized visa guidance (document checklist suggestions, bank statement formatting advice, proof of ties to home country, employment documentation, sponsor affidavit requirements).
2. For Nigerian applicants:
   - Understand Nigerian context (e.g., CAC registration documents for business owners, bank statement stamping with bank verification number or official stamp, explanation of large unexplained deposits/lump sums, letter of introduction from Nigerian employer, proof of family ties).
   - Address common UK Standard Visitor, Canada Temporary Resident Visa (TRV) / Study Permit, and Schengen Tourist Visa pitfalls.
3. Clarity and Formatting: Use clear headings, bullet points, and checklists. Keep explanations concise, practical, and readable on mobile screens.
4. Professional Boundary & Disclaimer: Always remind applicants when appropriate that VisaTrack AI provides preparation guidance and document organization support, not legal immigration representation or guarantees of visa issuance. Never guarantee an approval or pretend to have inside embassy contacts.
5. Tone: Respectful, reassuring, structured, and pragmatic.`;

  // If real Gemini API is available, invoke it
  if (aiClient && process.env.GEMINI_API_KEY) {
    try {

      let fullPrompt = '';
      if (context) {
        fullPrompt += `[Active Application Context: Destination: ${context.destination || 'Not specified'}, Visa Type: ${context.category || 'Not specified'}, Stage: ${context.stage || 'Preparation'}]\n\n`;
      }
      if (Array.isArray(history) && history.length > 0) {
        fullPrompt += 'Recent conversation:\n';
        for (const item of history.slice(-4)) {
          fullPrompt += `${item.sender === 'user' ? 'Traveler' : 'VisaTrack AI'}: ${item.text}\n`;
        }
        fullPrompt += '\n';
      }
      fullPrompt += `Current Question: ${message}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'I could not generate a response. Please try rephrasing your question.';

      res.json({
        reply: replyText,
        source: 'live_gemini',
        model: 'gemini-3.8-flash'
      });
      return;
    } catch (apiError: any) {
      console.error('Gemini API call failed, falling back to expert demo mode:', apiError);
      // Fall through to demo responder
    }
  }

  // Demo fallback response with realistic visa intelligence
  const normalizedMsg = message.toLowerCase();
  let demoReply = '';

  if (normalizedMsg.includes('uk') || normalizedMsg.includes('standard visitor')) {
    demoReply = `### UK Standard Visitor Visa (Nigerian Applicant Checklist)\n\nFor a standard visitor visa to the United Kingdom, UK Visas and Immigration (UKVI) looks for evidence that you are a genuine visitor who will leave the UK at the end of your visit.\n\n**Core Documents Required:**\n* **Valid International Passport:** Must have at least 1 full blank page and remain valid for the entirety of your visit.\n* **Proof of Financial Means:** 6 months stamped bank statements. Crucial tip: Avoid sudden unexplained "lump sum" deposits without a verifiable paper trail (e.g., sale of asset or gratuity slip).\n* **Proof of Employment / Business:**\n  - *Employed:* Introduction letter on company letterhead stating position, salary, leave approval, and tenure, accompanied by last 3-6 months payslips.\n  - *Business owner:* CAC Certificate of Incorporation, Form CAC 1.1/Status report, and FIRS Tax Clearance.\n* **Accommodation & Itinerary:** Hotel booking or host invitation letter along with host's UK passport or BRP/settled status copy and proof of address.\n* **Proof of Ties to Nigeria:** Marriage certificate, children's birth certificates, tenancy agreement or landed property deeds.\n\n*Note: [Demo Mode Active] To enable live AI with dynamic question answering, set GEMINI_API_KEY in the Secrets panel.*`;
  } else if (normalizedMsg.includes('proof of funds') || normalizedMsg.includes('bank statement') || normalizedMsg.includes('funds')) {
    demoReply = `### Understanding "Proof of Funds" for Visa Applications\n\nProof of funds is evidence that you have sufficient lawful money to cover all your travel, accommodation, and daily expenses without resorting to unauthorized work or public funds.\n\n**Key Principles for Nigerian Applicants:**\n1. **Consistency over Balance:** Visa officers inspect transaction patterns. A steady monthly salary or business turnover is significantly more credible than a sudden ₦10,000,000 deposit made two days before printing.\n2. **Official Stamping:** Statements must be stamped and signed by your commercial bank (e.g. GTBank, Zenith, Access, First Bank).\n3. **Explain Irregular Deposits:** If you received an authentic bonus, cooperative loan payoff, or gift, include a signed sworn affidavit or explanatory letter with supporting receipts.\n4. **Affidavit of Support (If Sponsored):** If a third party is sponsoring you, include their stamped bank statements, government ID, letter of sponsorship, and proof of relationship.\n\n*Note: [Demo Mode Active] Connect your GEMINI_API_KEY for conversational follow-ups.*`;
  } else if (normalizedMsg.includes('refusal') || normalizedMsg.includes('reject') || normalizedMsg.includes('appeal')) {
    demoReply = `### Decoding Visa Refusal Letters\n\nWhen UKVI, IRCC (Canada), or Schengen consulates refuse a visa, they provide an official refusal notice citing specific immigration rules.\n\n**Common Refusal Reasons for Nigerian Applicants:**\n* **Paragraph V 4.2 (UKVI) or Section 179(b) (IRCC):** Doubts about genuine intention to return home or sufficient personal/economic ties in Nigeria.\n* **Financial Discrepancies:** Unverified or unseasoned funds in bank accounts that do not match stated earnings.\n* **Unclear Purpose of Visit:** Lack of a coherent itinerary or conflicting information between your application form and supporting documents.\n\n**Recommended Next Steps:**\n1. Review the exact paragraphs marked in the refusal letter.\n2. Do not immediately re-apply with the identical documents; address every single refusal ground with new, concrete evidence.\n3. Consider requesting GCMS notes (for Canada) to see the visa officer's detailed handwritten notes.\n\n*Note: [Demo Mode Active] Set GEMINI_API_KEY in Secrets to analyze specific refusal paragraphs.*`;
  } else if (normalizedMsg.includes('organize') || normalizedMsg.includes('documents')) {
    demoReply = `### How to Organize Your Visa Documents (VisaTrack AI Best Practice)\n\nImmigration officers review hundreds of applications daily. An organized dossier improves readability:\n\n1. **Index Table of Contents:** Place a neat 1-page table of contents at the front of your document bundle.\n2. **Categorical Folder Structure:**\n   - **Folder 01 - Identity & Status:** Passport data page, national ID (NIN), previous visa copies.\n   - **Folder 02 - Purpose of Travel:** Cover letter, detailed day-to-day itinerary, flight reservations (do not purchase non-refundable tickets prior to visa approval).\n   - **Folder 03 - Financial Capacity:** 6 months stamped bank statements, payslips, investment certificates.\n   - **Folder 04 - Ties to Home Country:** Employment confirmation, leave approval, CAC documents, land/property deeds, family documents.\n3. **File Specifications:** Merge PDFs by category, keep file sizes under 4MB, and ensure all scanned pages are right-side-up with clear resolution.\n\n*Note: [Demo Mode Active] Use our interactive Documents and Checklist tabs to track every item.*`;
  } else {
    demoReply = `### VisaTrack AI Guidance\n\nThank you for your question regarding **"${message}"**.\n\nWhen preparing your visa dossier from Nigeria for international travel (UK, Canada, Schengen):\n* Always ensure all documents are authentic, clearly legible, and translated to English/French where required.\n* Double check that the dates on your bank statements and employment letters are current (within 28–30 days of submission).\n* Align your travel dates with your approved leave from work or school holiday schedules.\n\n*Notice: [Demo Mode Active] This response was provided via VisaTrack AI's offline knowledge base. To activate full interactive reasoning, configure GEMINI_API_KEY in AI Studio Settings.*`;
  }

  res.json({
    reply: demoReply,
    source: 'demo_fallback',
    model: 'visatrack-offline-v1'
  });
});

// Passport OCR extraction endpoint
app.post('/api/gemini/ocr', async (req: Request, res: Response) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    res.status(400).json({ error: 'imageBase64 is required' });
    return;
  }

  // If real Gemini API is available and image base64 provided
  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      // Strip data url prefix if present
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
      res.json({
        success: true,
        data: parsed,
        isDemoMode: false,
        source: 'gemini-3.8-flash-ocr'
      });
      return;
    } catch (err: any) {
      console.warn('Real Gemini OCR failed, falling back to simulated extraction:', err);
    }
  }

  // Demo fallback response (placeholder clearly identified)
  res.json({
    success: true,
    data: {
      surname: 'ADEBAYO',
      givenNames: 'CHIDIEBERE OLUWASEUN',
      passportNumber: 'A09876543',
      nationality: 'NIGERIAN',
      dateOfBirth: '1992-06-18',
      expiryDate: '2031-06-17',
      issueDate: '2021-06-18',
      sex: 'M',
      confidence: 'High (Sandbox extraction)',
    },
    isDemoMode: true,
    notice: 'Placeholder extraction: Gemini API is either unconfigured or returned sandbox data. Verify and confirm all fields before saving.'
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VisaTrack AI server running on port ${PORT} [mode: ${isProd ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start VisaTrack AI server:', err);
});
