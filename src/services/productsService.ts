import { Step } from '../models/bundle';

export const productsService = {
  getAll: async (): Promise<{ steps: Step[] }> => {
    const res = await fetch('/data/bundle-builder-data.json');
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  },
};