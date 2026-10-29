export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (page?: string, limit?: string): PaginationResult => {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 10));
  return { page: p, limit: l, skip: (p - 1) * l };
};