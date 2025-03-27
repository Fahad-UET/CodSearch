import type { Variable } from '../types/variable';

export const DEFAULT_VARIABLES: Variable[] = [
  // Pricing & Discounts
  {
    id: 'price',
    name: 'price',
    value: '99.99',
    type: 'currency',
    description: 'Regular product price',
  },
  {
    id: 'sale_price',
    name: 'sale_price',
    value: '79.99',
    type: 'currency',
    description: 'Discounted/sale price',
  },
  {
    id: 'discount',
    name: 'discount',
    value: '20',
    type: 'number',
    description: 'Discount percentage',
  },
  {
    id: 'savings',
    name: 'savings',
    value: '20.00',
    type: 'currency',
    description: 'Amount saved',
  },
  {
    id: 'currency',
    name: 'currency',
    value: 'AED',
    type: 'text',
    description: 'Currency code (AED, USD, etc)',
  },

  // Product Details
  {
    id: 'product_name',
    name: 'product_name',
    value: 'Premium Product',
    type: 'text',
    description: 'Name of the product',
  },
  {
    id: 'brand',
    name: 'brand',
    value: 'BrandName',
    type: 'text',
    description: 'Brand name',
  },
  {
    id: 'color',
    name: 'color',
    value: 'Black',
    type: 'text',
    description: 'Product color',
  },
  {
    id: 'size',
    name: 'size',
    value: 'Large',
    type: 'text',
    description: 'Product size',
  },
  {
    id: 'material',
    name: 'material',
    value: 'Premium Cotton',
    type: 'text',
    description: 'Product material',
  },

  // Stock & Availability
  {
    id: 'stock',
    name: 'stock',
    value: '50',
    type: 'number',
    description: 'Available stock quantity',
  },
  {
    id: 'sold',
    name: 'sold',
    value: '1000+',
    type: 'text',
    description: 'Number of units sold',
  },
  {
    id: 'rating',
    name: 'rating',
    value: '4.8',
    type: 'text',
    description: 'Product rating',
  },
  {
    id: 'reviews',
    name: 'reviews',
    value: '500+',
    type: 'text',
    description: 'Number of reviews',
  },

  // Shipping & Delivery
  {
    id: 'shipping',
    name: 'shipping',
    value: 'Free',
    type: 'text',
    description: 'Shipping cost or status',
  },
  {
    id: 'shipping_method',
    name: 'shipping_method',
    value: 'Express Delivery',
    type: 'text',
    description: 'Shipping method',
  },

  // Location & Market
  {
    id: 'country',
    name: 'country',
    value: 'UAE',
    type: 'text',
    description: 'Target country',
  },
  {
    id: 'city',
    name: 'city',
    value: 'Dubai',
    type: 'text',
    description: 'Target city',
  },
  {
    id: 'store',
    name: 'store',
    value: 'Dubai Mall',
    type: 'text',
    description: 'Store location',
  },

  // Promotions & Urgency
  {
    id: 'coupon',
    name: 'coupon',
    value: 'SAVE20',
    type: 'text',
    description: 'Coupon code',
  },
  {
    id: 'deadline',
    name: 'deadline',
    value: '24 hours',
    type: 'text',
    description: 'Offer deadline',
  },
  {
    id: 'min_order',
    name: 'min_order',
    value: '200',
    type: 'currency',
    description: 'Minimum order value',
  },

  // Warranty & Returns
  {
    id: 'warranty',
    name: 'warranty',
    value: '1 year',
    type: 'text',
    description: 'Warranty period',
  },
  {
    id: 'return_period',
    name: 'return_period',
    value: '30 days',
    type: 'text',
    description: 'Return period',
  },

  // Payment
  {
    id: 'payment_method',
    name: 'payment_method',
    value: 'Cash on Delivery',
    type: 'text',
    description: 'Payment method',
  },
  {
    id: 'installment',
    name: 'installment',
    value: '4 payments',
    type: 'text',
    description: 'Installment options',
  },

  // Customer Support
  {
    id: 'support_hours',
    name: 'support_hours',
    value: '24/7',
    type: 'text',
    description: 'Customer support hours',
  },
  {
    id: 'whatsapp',
    name: 'whatsapp',
    value: '+971501234567',
    type: 'text',
    description: 'WhatsApp contact',
  },
  {
    id: 'phone',
    name: 'phone',
    value: '+97143216789',
    type: 'text',
    description: 'Phone number',
  },
  {
    id: 'address',
    name: 'address',
    value: 'Dubai Mall, Sheikh Mohammed Bin Rashid Blvd',
    type: 'text',
    description: 'Store/Business address',
  },
  {
    id: 'store_name',
    name: 'store_name',
    value: 'Your Store Name',
    type: 'text',
    description: 'Name of your store',
  },
  {
    id: 'store_link',
    name: 'store_link',
    value: 'https://yourstore.com',
    type: 'text',
    description: 'Link to your store',
  },
  {
    id: 'email',
    name: 'email',
    value: 'contact@yourstore.com',
    type: 'text',
    description: 'Contact email address',
  },
  {
    id: 'facebook_page',
    name: 'facebook_page',
    value: 'https://facebook.com/yourstore',
    type: 'text',
    description: 'Facebook page URL',
  },
  {
    id: 'tiktok_link',
    name: 'tiktok_link',
    value: 'https://tiktok.com/@yourstore',
    type: 'text',
    description: 'TikTok profile URL',
  },
  {
    id: 'instagram_link',
    name: 'instagram_link',
    value: 'https://instagram.com/yourstore',
    type: 'text',
    description: 'Instagram profile URL',
  },
  {
    id: 'snapchat_link',
    name: 'snapchat_link',
    value: 'https://snapchat.com/add/yourstore',
    type: 'text',
    description: 'Snapchat profile URL',
  },
  {
    id: 'weight',
    name: 'weight',
    value: '500g',
    type: 'text',
    description: 'Product weight',
  },
  {
    id: 'dimensions',
    name: 'dimensions',
    value: '30 x 20 x 10 cm',
    type: 'text',
    description: 'Product dimensions',
  },
  {
    id: 'duration',
    name: 'duration',
    value: '60 minutes',
    type: 'text',
    description: 'Duration/Length',
  },
  {
    id: 'delivery_time',
    name: 'delivery_time',
    value: '2-3 business days',
    type: 'text',
    description: 'Delivery timeframe',
  },
];
