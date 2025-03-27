import { Product } from "@/types";

interface ProductData {
  title: string;
  description: string;
  price: number;
  images: string[];
  links: string[];
  tasks: string[];
  [key: string]: any;
}

export const exportProductToCSV = (product: Product): string => {
  const headers = [
    'Title',
    'Description',
    'Price',
    'Images',
    'Links',
    'Tasks'
  ];

  const rows = [
    [
      product.title || '',
      product.description || '',
      product.price?.toString() || '',
      (product.images || []).join('; '),
      (product.links || []).join('; '),
      (product.tasks || []).join('; ')
    ]
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
};

export const downloadProductCSV = (product: Product) => {
  const csvContent = exportProductToCSV(product);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${product.title || 'product'}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};