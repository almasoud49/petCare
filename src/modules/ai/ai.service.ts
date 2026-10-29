import { ChatMessage } from './chat.model';
import { Service } from '../service/service.model';
import { Booking } from '../booking/booking.model';
import { gemini, GEMINI_MODEL } from '../../config/gemini';

const SYSTEM_PROMPT = `You are a helpful assistant for a Pet Care & Services platform.
Answer questions about grooming, vet, boarding, training, walking.
Be concise (max 5 sentences). If asked to book, guide the user to the booking page.`;

// 1. AI Chat Assistant
export const chatWithAssistant = async (
  sessionId: string,
  userMessage: string,
  userId?: string
) => {
  // Save the user's message to your DB
  await ChatMessage.create({ sessionId, user: userId, role: 'user', content: userMessage });

  // Fetch recent history from DB (limit to last 20 messages)
  const history = await ChatMessage.find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(20)
    .lean();

  // Build context string from history (excluding the current message)
  const contextString = history
    .slice(0, -1)
    .map((h) => `${h.role === 'assistant' ? 'Assistant' : 'User'}: ${h.content}`)
    .join('\n');

  const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation history:\n${contextString}\n\nUser: ${userMessage}\n\nAssistant:`;

  let answer = 'Sorry, I could not generate a response. Please try again later.';
  try {
    const resp = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: fullPrompt,
    });
    answer = resp.text?.trim() || answer;
  } catch (err: any) {
    console.error('AI chat error:', err?.message || err);
  }

  // Save the assistant's response to your DB
  await ChatMessage.create({ sessionId, user: userId, role: 'assistant', content: answer });

  return answer;
};

// 2. AI Search Suggestions
export const suggestSearch = async (q: string) => {
  const results = await Service.find(
    { title: new RegExp(q, 'i'), isActive: true },
    'title category'
  )
    .limit(5)
    .lean();

  if (results.length > 0) {
    return results.map((r: any) => r.title);
  }

  try {
    const resp = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Return 5 short pet-care search keywords for the user query: "${q}". Comma-separated only.`,
    });
    const raw = resp.text || '';
    return raw.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 5);
  } catch {
    return [];
  }
};

// 3. AI Recommendations (unchanged)
export const getPersonalizedRecommendations = async (userId?: string) => {
  if (userId) {
    const pastCategories = (await Booking.find({ user: userId })
      .populate('service', 'category')
      .distinct('service.category')) as string[];

    if (pastCategories.length) {
      const filter: any = {
        category: { $in: pastCategories },
        isActive: true,
      };
      return Service.find(filter).sort({ rating: -1 }).limit(6).lean();
    }
  }
  return Service.find({ isActive: true }).sort({ rating: -1, reviewCount: -1 }).limit(6).lean();
};

// 4. Trending services (unchanged)
export const getTrendingServices = async () =>
  Booking.aggregate([
    { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
    { $group: { _id: '$service', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'service',
      },
    },
    { $unwind: '$service' },
    { $replaceRoot: { newRoot: { $mergeObjects: ['$service', { trendingScore: '$count' }] } } },
  ]);

// 5. AI-generated blog idea
export const generateBlogIdeas = async (topic: string) => {
  try {
    const resp = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Generate 5 blog titles for a pet care platform about "${topic}". Return as a JSON array of objects with fields: title, excerpt. No other text.`,
      config: { responseMimeType: 'application/json' },
    });

    const text = resp.text || '[]';
    try {
      return JSON.parse(text);
    } catch {
      return [];
    }
  } catch {
    return [];
  }
};
