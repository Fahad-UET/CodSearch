import { Product } from '../../../types';

interface VerificationCheck {
  id: string;
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export interface VerificationResult {
  success: boolean;
  timestamp: Date;
  checks: VerificationCheck[];
  summary: {
    total: number;
    passed: number;
    warnings: number;
    errors: number;
  };
}

export async function runVerification(product: Product): Promise<VerificationResult> {
  const checks: VerificationCheck[] = [];
  
  // Title Check
  checks.push({
    id: 'title',
    name: 'Title',
    status: product.title.length >= 5 ? 'success' : 'error',
    message: product.title.length >= 5 ? 'Title is valid' : 'Title is too short',
    details: 'Title should be at least 5 characters long'
  });
  
  // Description Check
  checks.push({
    id: 'description',
    name: 'Description',
    status: product.description?.length ? 'success' : 'warning',
    message: product.description?.length ? 'Description is present' : 'Missing description',
    details: 'A good description helps with SEO and customer understanding'
  });
  
  // Images Check
  const imageCount = product.images?.length || 0;
  checks.push({
    id: 'images',
    name: 'Images',
    status: imageCount >= 3 ? 'success' : imageCount > 0 ? 'warning' : 'error',
    message: imageCount > 0 
      ? `${imageCount} images found` 
      : 'No images found',
    details: 'Recommend at least 3 high-quality images'
  });
  
  // Price Check
  const hasValidPrices = product.purchasePrice > 0 && product.salePrice > 0;
  const profitMargin = hasValidPrices 
    ? ((product.salePrice - product.purchasePrice) / product.salePrice) * 100 
    : 0;
  
  checks.push({
    id: 'pricing',
    name: 'Pricing',
    status: hasValidPrices 
      ? profitMargin >= 30 ? 'success' : 'warning'
      : 'error',
    message: hasValidPrices
      ? `Profit margin: ${profitMargin.toFixed(1)}%`
      : 'Missing price information',
    details: 'Recommended profit margin is at least 30%'
  });
  
  // Competitor Prices Check
  const hasCompetitorPrices = product.competitorPrices && 
    Object.values(product.competitorPrices).some((price: number) => price > 0);
  
  checks.push({
    id: 'competitors',
    name: 'Competitor Research',
    status: hasCompetitorPrices ? 'success' : 'warning',
    message: hasCompetitorPrices 
      ? 'Competitor prices found'
      : 'No competitor prices found',
    details: 'Competitor research helps with pricing strategy'
  });
  
  // Calculate summary
  const summary = checks.reduce((acc, check) => ({
    total: acc.total + 1,
    passed: acc.passed + (check.status === 'success' ? 1 : 0),
    warnings: acc.warnings + (check.status === 'warning' ? 1 : 0),
    errors: acc.errors + (check.status === 'error' ? 1 : 0)
  }), {
    total: 0,
    passed: 0,
    warnings: 0,
    errors: 0
  });
  return {
    success: summary.errors === 0,
    timestamp: new Date(),
    checks,
    summary
  };
}