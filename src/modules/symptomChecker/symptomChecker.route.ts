import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { gemini, GEMINI_MODEL } from '../../config/gemini';
import { aiLimiter } from '../../middleware/rateLimit';

const router = Router();

router.post(
  '/check',
  aiLimiter,
  catchAsync(async (req, res) => {
    const { species, symptoms, age, notes } = req.body;

    const prompt = `You are a veterinary triage assistant. Given: species=${species}, age=${age}, symptoms="${symptoms}", notes="${notes}".
Return STRICT JSON with this schema:
{
  "urgency": "low" | "medium" | "high" | "emergency",
  "possibleCauses": [{"name": "string", "likelihood": "low|medium|high", "description": "string"}],
  "recommendedActions": ["string"],
  "vetVisitRecommended": boolean,
  "disclaimer": "string"
}
No other text.`;

    let result: any = {};
    try {
      const resp = await gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const raw = resp.text || '{}';
      result = JSON.parse(raw);
    } catch {
      result = { error: 'Failed to parse AI response' };
    }

    res.json(new ApiResponse('Symptom analysis', result));
  })
);

export default router;
