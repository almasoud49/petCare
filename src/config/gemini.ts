import { GoogleGenAI } from '@google/genai';
import { env } from './env';

export const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// A model that is currently available for generateContent.
export const GEMINI_MODEL = 'gemini-3-flash-preview';
