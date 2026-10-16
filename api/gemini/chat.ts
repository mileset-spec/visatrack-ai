import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

async function parseBody(req: IncomingMessage): Promise<any> {
  // If already parsed by Vercel
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

  const { message, history, context } = body;

  if (!message || typeof message !== 'string') {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Message is required' }));
    return;
  }

  const systemInstruction = `You are VisaTrack AI, a knowledgeable, empathetic, and professional visa preparation assistant for international travelers, specializing in assisting Nigerian citizens and residents applying for visas to Canada, the United Kingdom, and the Schengen Area (France, Germany, Italy, Netherlands, etc.).

Key Behavioral Guidelines:
1. Provide accurate, practical, and highly organized visa guidance (document checklist suggestions, bank statement formatting advice, proof of ties to home country, employment documentation, sponsor affidavit requirements).
2. For Nigerian applicants:
   - Understand Nigerian context (e.g., CAC registration documents for business owners, bank statement stamping with bank verification number or official stamp, explanation of large unexplained deposits/lump sums, letter of introduction from Nigerian employer, proof of family ties).
   - Address common UK Standard Visitor, Canada Temporary Resident Visa (TRV) / Study Permit, and Schengen Tourist Visa pitfalls.
3. Clarity and Formatting: Use clear headings, bullet points, and checklists. Keep explanations concise, practical, and readable on mobile screens.
4. Professional Boundary & Disclaimer: Always remind applicants when appropriate that VisaTrack AI provides preparation guidance and document organization support, not legal immigration representation or guarantees of visa issuance. Never guarantee an approval or pretend to have inside embassy contacts.
5. Tone: Respectful, reassuring, structured, and pragmatic.`;

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

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          reply: replyText,
          source: 'live_gemini',
          model: 'gemini-3.8-flash',
        })
      );
      return;
    } catch (apiError: any) {
      console.error('Vercel Gemini API call failed, falling back to demo mode:', apiError);
    }
  }

  // Fallback demo knowledge base
  const normalizedMsg = message.toLowerCase();
  let demoReply = '';

  if (normalizedMsg.includes('uk') || normalizedMsg.includes('standard visitor')) {
    demoReply = `### UK Standard Visitor Visa (Nigerian Applicant Checklist)\n\nFor a standard visitor visa to the United Kingdom, UK Visas and Immigration (UKVI) looks for evidence that you are a genuine visitor who will leave the UK at the end of your visit.\n\n**Core Documents Required:**\n* **Valid International Passport:** Must have at least 1 full blank page and remain valid for the entirety of your visit.\n* **Proof of Financial Means:** 6 months stamped bank statements. Crucial tip: Avoid sudden unexplained "lump sum" deposits without a verifiable paper trail (e.g., sale of asset or gratuity slip).\n* **Proof of Employment / Business:**\n  - *Employed:* Introduction letter on company letterhead stating position, salary, leave approval, and tenure, accompanied by last 3-6 months payslips.\n  - *Business owner:* CAC Certificate of Incorporation, Form CAC 1.1/Status report, and FIRS Tax Clearance.\n* **Accommodation & Itinerary:** Hotel booking or host invitation letter along with host's UK passport or BRP/settled status copy and proof of address.\n* **Proof of Ties to Nigeria:** Marriage certificate, children's birth certificates, tenancy agreement or landed property deeds.\n\n*Note: [Demo Mode Active] To enable live AI with dynamic question answering, set GEMINI_API_KEY in the Vercel Environment Variables.*`;
  } else if (normalizedMsg.includes('proof of funds') || normalizedMsg.includes('bank statement') || normalizedMsg.includes('funds')) {
    demoReply = `### Understanding "Proof of Funds" for Visa Applications\n\nProof of funds is evidence that you have sufficient lawful money to cover all your travel, accommodation, and daily expenses without resorting to unauthorized work or public funds.\n\n**Key Principles for Nigerian Applicants:**\n1. **Consistency over Balance:** Visa officers inspect transaction patterns. A steady monthly salary or business turnover is significantly more credible than a sudden ₦10,000,000 deposit made two days before printing.\n2. **Official Stamping:** Statements must be stamped and signed by your commercial bank (e.g. GTBank, Zenith, Access, First Bank).\n3. **Explain Irregular Deposits:** If you received an authentic bonus, cooperative loan payoff, or gift, include a signed sworn affidavit or explanatory letter with supporting receipts.\n4. **Affidavit of Support (If Sponsored):** If a third party is sponsoring you, include their stamped bank statements, government ID, letter of sponsorship, and proof of relationship.\n\n*Note: [Demo Mode Active] Connect your GEMINI_API_KEY for conversational follow-ups.*`;
  } else {
    demoReply = `### VisaTrack AI Guidance\n\nThank you for your question regarding **"${message}"**.\n\nWhen preparing your visa dossier from Nigeria for international travel (UK, Canada, Schengen):\n* Always ensure all documents are authentic, clearly legible, and translated to English/French where required.\n* Double check that the dates on your bank statements and employment letters are current (within 28–30 days of submission).\n* Align your travel dates with your approved leave from work or school holiday schedules.\n\n*Notice: [Demo Mode Active] To activate full interactive reasoning, configure GEMINI_API_KEY in Vercel project settings.*`;
  }

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      reply: demoReply,
      source: 'demo_fallback',
      model: 'visatrack-offline-v1',
    })
  );
}
