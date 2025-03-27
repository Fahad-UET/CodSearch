import { saveAs } from 'file-saver';

interface ProductData {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  images?: { url: string; alt?: string }[];
  links?: string[];
  [key: string]: any;
}

export function exportProductToCSV(product: ProductData) {
  // Prepare data rows
  const rows = [
    ['Category', 'Value'], // Header row
    ['ID', product.id],
    ['Title', product.title || ''],
    ['Description', product.description || ''],
    ['Price', product.price?.toString() || ''],
  ];

  // Add images
  if (product.images?.length) {
    product.images.forEach((img, index) => {
      rows.push([`Image ${index + 1}`, img.url]);
      if (img.alt) rows.push([`Image ${index + 1} Alt`, img.alt]);
    });
  }

  // Add links
  if (product.links?.length) {
    product.links.forEach((link, index) => {
      rows.push([`Link ${index + 1}`, link]);
    });
  }

  // Convert to CSV format
  const csvContent = rows
    .map(row => row.map(cell => `"${cell?.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `product-${product.id}.csv`);
}