export interface ChatResponse {
  reply: string;
  source: string;
  model: string;
}

export interface OcrResponse {
  success: boolean;
  data: {
    surname: string;
    givenNames: string;
    passportNumber: string;
    nationality: string;
    dateOfBirth: string;
    expiryDate: string;
    issueDate?: string;
    sex?: string;
    confidence?: string;
  };
  isDemoMode: boolean;
  notice?: string;
}

export const api = {
  async checkHealth(): Promise<{ status: string; geminiConfigured: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check non-ok');
      return await res.json();
    } catch {
      return { status: 'offline', geminiConfigured: false };
    }
  },

  async askAssistant(message: string, history: any[], context?: any): Promise<ChatResponse> {
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, context }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn('API call failed, providing local demo fallback:', err);
      return {
        reply: `### Visa Preparation Guidance\n\nThank you for asking about **"${message}"**.\n\n* **Primary Principle:** Embassy consular officers evaluate genuine intent to return, financial sufficiency, and purpose of visit.\n* **Essential Dossier:** Ensure 6 months of continuous, stamped bank statements, clean employment letter with leave sanction, and a clear daily itinerary.\n* **Caution:** Never purchase non-refundable flight tickets or pay final hotel non-refundable balances prior to visa issuance.\n\n*(Note: Running in offline prototype mode)*`,
        source: 'client_fallback',
        model: 'offline-embedded-v1',
      };
    }
  },

  async scanPassportImage(imageBase64: string): Promise<OcrResponse> {
    try {
      const res = await fetch('/api/gemini/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!res.ok) {
        throw new Error(`Server OCR error: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.warn('OCR request fallback:', err);
      return {
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
          confidence: 'Simulated Extraction (Sandbox)',
        },
        isDemoMode: true,
        notice: 'Extraction completed in sandbox mode. Review all fields before confirming.',
      };
    }
  },
};
