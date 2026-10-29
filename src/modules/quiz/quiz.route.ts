import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Product } from '../product/product.model';
import { gemini, GEMINI_MODEL } from '../../config/gemini';
import { aiLimiter } from '../../middleware/rateLimit';

const router = Router();

/**
 * POST /api/v1/quiz/recommend
 * Body: { species, age, weight, size, dietaryNeeds, budget }
 * Returns: 6 product recommendations (AI-powered)
 */
router.post(
  '/recommend',
  aiLimiter,
  catchAsync(async (req, res) => {
    const { species, age, weight, size, dietaryNeeds, budget } = req.body;

    // 1. Fetch candidate products by species + type
    const candidates = await Product.find({
      species: { $in: [species] },
      isActive: true,
      stock: { $gt: 0 },
    })
      .select('name brand type basePrice images rating reviewCount variants tags')
      .limit(50)
      .lean();

    if (candidates.length === 0) {
      return res.json(
        new ApiResponse('No products match your pet', { products: [], reason: 'no_match' })
      );
    }

    // 2. Ask AI to rank
    const prompt = `You are a pet nutrition expert. A pet owner has:
Species: ${species}, Age: ${age} years, Weight: ${weight}kg, Size: ${size}
Dietary needs: ${dietaryNeeds || 'none'}
Budget: ৳${budget || 'any'}

From these products, pick the BEST 6 and return STRICT JSON: { "ids": ["id1","id2",...] }
Products: ${JSON.stringify(
      candidates.map((p: any) => ({
        id: p._id,
        name: p.name,
        type: p.type,
        price: p.basePrice,
        tags: p.tags,
      }))
    )}`;

    let recommendedIds: string[] = [];
    try {
      const resp = await gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const parsed = JSON.parse(resp.text || '{}');
      recommendedIds = parsed.ids || [];
    } catch {
      // Fallback: sort by rating
      recommendedIds = candidates
        .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6)
        .map((p: any) => p._id.toString());
    }

    const products = recommendedIds
      .map((id) => candidates.find((p: any) => p._id.toString() === id))
      .filter(Boolean);

    res.json(new ApiResponse('Recommendations', { products }));
  })
);

export default router;
