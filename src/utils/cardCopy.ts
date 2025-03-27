import { Product } from '../types';
import { CopyOptions } from '../types/card-relationships';

export function createCardCopy(
  sourceProduct: Product,
  options: CopyOptions,
  makeChild: boolean = false
): Omit<Product, 'id'> {
  const copy: Partial<Product> = {
    createdAt: new Date(),
    updatedAt: new Date(),
    category: sourceProduct.category
  };

  if (options.title) {
    copy.title = `${sourceProduct.title} (Copy)`;
  }

  if (options.description) {
    copy.description = sourceProduct.description;
  }

  if (options.images) {
    copy.images = [...(sourceProduct.images || [])];
  }

  if (options.videos) {
    copy.videoLinks = [...(sourceProduct.videoLinks || [])];
  }

  if (options.links) {
    copy.links = [...(sourceProduct.links || [])];
  }

  if (options.prices) {
    copy.purchasePrice = sourceProduct.purchasePrice;
    copy.salePrice = sourceProduct.salePrice;
    copy.competitorPrices = sourceProduct.competitorPrices 
      ? { ...sourceProduct.competitorPrices }
      : undefined;
  }

  if (options.notes) {
    copy.notes = [...(sourceProduct.notes || [])];
  }

  if (options.tasks) {
    copy.tasks = [...(sourceProduct.tasks || [])].map(task => ({
      ...task,
      id: `task-${Date.now()}-${Math.random()}`,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  if (options.metrics) {
    copy.metrics = sourceProduct.metrics 
      ? { ...sourceProduct.metrics }
      : undefined;
  }

  return copy as Omit<Product, 'id'>;
}
