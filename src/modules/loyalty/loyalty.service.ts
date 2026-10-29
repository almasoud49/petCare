import { Loyalty } from './loyalty.model';

export const getOrCreate = async (userId: string) => {
  let l = await Loyalty.findOne({ user: userId });
  if (!l) l = await Loyalty.create({ user: userId });
  return l;
};

export const addPoints = async (
  userId: string,
  points: number,
  reason: string,
  amountSpent = 0
) => {
  const l = await getOrCreate(userId);
  l.points += points;
  l.totalSpent += amountSpent;
  l.history.push({ change: points, reason, at: new Date() });
  (l as any).recomputeTier();
  await l.save();
  return l;
};

export const redeem = async (userId: string, points: number) => {
  const l = await getOrCreate(userId);
  if (l.points < points) throw new Error('Insufficient points');
  l.points -= points;
  l.history.push({ change: -points, reason: 'Redeemed', at: new Date() });
  await l.save();
  return l;
};