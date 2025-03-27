export type QuickPhrase = {
  text: string;
  category: string;
  emoji?: string;
};

export type QuickPhrasesByLanguage = {
  [key: string]: {
    [category: string]: QuickPhrase[];
  };
};

export const quickPhrases: QuickPhrasesByLanguage = {
  ar: {
    'Cash & Delivery': [
      { text: 'التوصيل مجاني', category: 'Cash & Delivery', emoji: '🚚' },
      { text: 'التوصيل مجاني والدفع عند الاستلام', category: 'Cash & Delivery', emoji: '💰' },
      {
        text: 'وصلك المنتج لين باب بيتك، وفلوسك محفوظة لين تتأكد من الجودة!',
        category: 'Cash & Delivery',
        emoji: '🏠',
      },
      {
        text: 'ادفع بس بعد ما تشوف المنتج بنفسك، راحتك تهمنا!',
        category: 'Cash & Delivery',
        emoji: '👀',
      },
      {
        text: 'خدمة الدفع عند الاستلام، لأن ثقتكم أغلى شي عندنا!',
        category: 'Cash & Delivery',
        emoji: '🤝',
      },
      {
        text: 'ما تحتاج تدفع مقدم، ندفع عنك ونوصلك الطلب!',
        category: 'Cash & Delivery',
        emoji: '💳',
      },
      {
        text: 'منتجات مضمونة، والدفع بعد ما تستلم بكل راحة',
        category: 'Cash & Delivery',
        emoji: '✨',
      },
      { text: 'جربنا مرة، وتأكد إنك بتكررها كل مرة!', category: 'Cash & Delivery', emoji: '🔄' },
      {
        text: 'الدفع عند الاستلام متوفر في جميع المناطق',
        category: 'Cash & Delivery',
        emoji: '📍',
      },
      { text: 'استلم طلبك اليوم وادفع بعدين', category: 'Cash & Delivery', emoji: '📦' },
    ],
    'Product Features': [
      { text: 'جودة عالية مضمونة', category: 'Product Features', emoji: '✨' },
      { text: 'منتج أصلي 100%', category: 'Product Features', emoji: '💯' },
      { text: 'ضمان لمدة سنة', category: 'Product Features', emoji: '📅' },
      { text: 'متوفر بعدة ألوان', category: 'Product Features', emoji: '🎨' },
      { text: 'تصميم عصري وأنيق', category: 'Product Features', emoji: '🎯' },
    ],
    'Social Proof': [
      { text: 'الأكثر مبيعاً', category: 'Social Proof', emoji: '🏆' },
      { text: 'تقييم 5 نجوم', category: 'Social Proof', emoji: '⭐' },
      { text: 'اختيار الزبائن', category: 'Social Proof', emoji: '👥' },
      { text: 'موثوق به من آلاف العملاء', category: 'Social Proof', emoji: '🤝' },
      { text: 'منتج رقم 1 في السوق', category: 'Social Proof', emoji: '📈' },
    ],
    'Call to Action': [
      { text: 'اشترِ الآن', category: 'Call to Action', emoji: '🛍️' },
      { text: 'احجز موعدك', category: 'Call to Action', emoji: '📅' },
      { text: 'اكتشف المزيد', category: 'Call to Action', emoji: '🔍' },
      { text: 'سجل الآن', category: 'Call to Action', emoji: '✍️' },
      { text: 'تسوق الآن', category: 'Call to Action', emoji: '🛒' },
    ],
    Promotions: [
      { text: 'عرض محدود', category: 'Promotions', emoji: '⏰' },
      { text: 'خصم حصري', category: 'Promotions', emoji: '💎' },
      { text: 'توفير كبير', category: 'Promotions', emoji: '💰' },
      { text: 'عرض خاص', category: 'Promotions', emoji: '🎯' },
      { text: 'أسعار تنافسية', category: 'Promotions', emoji: '🏷️' },
    ],
    Urgency: [
      { text: 'لفترة محدودة', category: 'Urgency', emoji: '⌛' },
      { text: 'العرض ينتهي قريباً', category: 'Urgency', emoji: '⚡' },
      { text: 'الكمية محدودة', category: 'Urgency', emoji: '📊' },
      { text: 'اغتنم الفرصة', category: 'Urgency', emoji: '🎯' },
      { text: 'لا تفوت العرض', category: 'Urgency', emoji: '🔥' },
    ],
  },
  en: {
    'Cash & Delivery': [
      { text: 'Free Delivery', category: 'Cash & Delivery', emoji: '🚚' },
      { text: 'Cash on Delivery Available', category: 'Cash & Delivery', emoji: '💰' },
      { text: 'Pay Only After You Receive', category: 'Cash & Delivery', emoji: '📦' },
      { text: 'Doorstep Delivery & Payment', category: 'Cash & Delivery', emoji: '🏠' },
      { text: 'Your Money is Safe - Pay on Delivery', category: 'Cash & Delivery', emoji: '🔒' },
      { text: 'No Advance Payment Needed', category: 'Cash & Delivery', emoji: '💳' },
      { text: 'Secure Payment After Delivery', category: 'Cash & Delivery', emoji: '✅' },
      { text: 'Try First, Pay Later', category: 'Cash & Delivery', emoji: '👀' },
      { text: 'Nationwide Cash on Delivery', category: 'Cash & Delivery', emoji: '🌍' },
      { text: 'Get it Today, Pay on Delivery', category: 'Cash & Delivery', emoji: '⚡' },
    ],
    'Product Features': [
      { text: 'Premium Quality Guaranteed', category: 'Product Features', emoji: '✨' },
      { text: '100% Authentic Product', category: 'Product Features', emoji: '💯' },
      { text: '1-Year Warranty', category: 'Product Features', emoji: '📅' },
      { text: 'Available in Multiple Colors', category: 'Product Features', emoji: '🎨' },
      { text: 'Modern & Elegant Design', category: 'Product Features', emoji: '🎯' },
    ],
    'Social Proof': [
      { text: 'Best Seller', category: 'Social Proof', emoji: '🏆' },
      { text: '5-Star Rating', category: 'Social Proof', emoji: '⭐' },
      { text: 'Customer Choice', category: 'Social Proof', emoji: '👥' },
      { text: 'Trusted by Thousands', category: 'Social Proof', emoji: '🤝' },
      { text: '#1 in Market', category: 'Social Proof', emoji: '📈' },
    ],
    'Call to Action': [
      { text: 'Shop Now', category: 'Call to Action', emoji: '🛍️' },
      { text: 'Learn More', category: 'Call to Action', emoji: '📚' },
      { text: 'Get Started', category: 'Call to Action', emoji: '🚀' },
      { text: 'Sign Up Today', category: 'Call to Action', emoji: '✍️' },
      { text: 'Book Your Appointment', category: 'Call to Action', emoji: '📅' },
    ],
    Promotions: [
      { text: 'Limited Time Offer', category: 'Promotions', emoji: '⏰' },
      { text: 'Exclusive Deal', category: 'Promotions', emoji: '💎' },
      { text: 'Special Discount', category: 'Promotions', emoji: '🏷️' },
      { text: 'Save Big', category: 'Promotions', emoji: '💰' },
      { text: 'Best Value', category: 'Promotions', emoji: '🌟' },
    ],
    Urgency: [
      { text: 'While Supplies Last', category: 'Urgency', emoji: '📦' },
      { text: 'Limited Stock', category: 'Urgency', emoji: '⚡' },
      { text: "Don't Miss Out", category: 'Urgency', emoji: '🎯' },
      { text: 'Act Now', category: 'Urgency', emoji: '🏃' },
      { text: 'Last Chance', category: 'Urgency', emoji: '⌛' },
    ],
  },
  fr: {
    'Product Features': [
      { text: 'Qualité Premium Garantie', category: 'Product Features', emoji: '✨' },
      { text: 'Produit 100% Authentique', category: 'Product Features', emoji: '💯' },
      { text: 'Garantie 1 An', category: 'Product Features', emoji: '📅' },
      { text: 'Disponible en Plusieurs Couleurs', category: 'Product Features', emoji: '🎨' },
      { text: 'Design Moderne & Élégant', category: 'Product Features', emoji: '🎯' },
    ],
    'Social Proof': [
      { text: 'Meilleure Vente', category: 'Social Proof', emoji: '🏆' },
      { text: 'Note 5 Étoiles', category: 'Social Proof', emoji: '⭐' },
      { text: 'Choix des Clients', category: 'Social Proof', emoji: '👥' },
      { text: 'Approuvé par des Milliers', category: 'Social Proof', emoji: '🤝' },
      { text: 'N°1 sur le Marché', category: 'Social Proof', emoji: '📈' },
    ],
    'Cash & Delivery': [
      { text: 'Livraison Gratuite', category: 'Cash & Delivery', emoji: '🚚' },
      { text: 'Paiement à la Livraison', category: 'Cash & Delivery', emoji: '💰' },
      { text: 'Payez Après Réception', category: 'Cash & Delivery', emoji: '📦' },
      {
        text: 'Livraison à Domicile - Payez à la Réception',
        category: 'Cash & Delivery',
        emoji: '🏠',
      },
      {
        text: 'Votre Argent est Sécurisé - Payez à la Livraison',
        category: 'Cash & Delivery',
        emoji: '🔒',
      },
      { text: "Aucun Paiement à l'Avance", category: 'Cash & Delivery', emoji: '💳' },
      { text: 'Paiement Sécurisé à la Livraison', category: 'Cash & Delivery', emoji: '✅' },
      { text: "Essayez d'Abord, Payez Après", category: 'Cash & Delivery', emoji: '👀' },
      { text: 'Livraison Contre Remboursement Partout', category: 'Cash & Delivery', emoji: '🌍' },
      {
        text: "Recevez Aujourd'hui, Payez à la Livraison",
        category: 'Cash & Delivery',
        emoji: '⚡',
      },
    ],
    'Call to Action': [
      { text: 'Achetez Maintenant', category: 'Call to Action', emoji: '🛍️' },
      { text: 'En Savoir Plus', category: 'Call to Action', emoji: '📚' },
      { text: 'Commencez', category: 'Call to Action', emoji: '🚀' },
      { text: 'Inscrivez-vous', category: 'Call to Action', emoji: '✍️' },
      { text: 'Réservez', category: 'Call to Action', emoji: '📅' },
    ],
    Promotions: [
      { text: 'Offre Limitée', category: 'Promotions', emoji: '⏰' },
      { text: 'Offre Exclusive', category: 'Promotions', emoji: '💎' },
      { text: 'Remise Spéciale', category: 'Promotions', emoji: '🏷️' },
      { text: 'Économisez Gros', category: 'Promotions', emoji: '💰' },
      { text: 'Meilleur Prix', category: 'Promotions', emoji: '🌟' },
    ],
    Urgency: [
      { text: 'Stock Limité', category: 'Urgency', emoji: '📦' },
      { text: 'Ne Manquez Pas', category: 'Urgency', emoji: '🎯' },
      { text: 'Dernière Chance', category: 'Urgency', emoji: '⌛' },
      { text: 'Agissez Vite', category: 'Urgency', emoji: '🏃' },
      { text: 'Offre Temporaire', category: 'Urgency', emoji: '⚡' },
    ],
  },
  es: {
    'Product Features': [
      { text: 'Calidad Premium Garantizada', category: 'Product Features', emoji: '✨' },
      { text: 'Producto 100% Auténtico', category: 'Product Features', emoji: '💯' },
      { text: 'Garantía de 1 Año', category: 'Product Features', emoji: '📅' },
      { text: 'Disponible en Varios Colores', category: 'Product Features', emoji: '🎨' },
      { text: 'Diseño Moderno y Elegante', category: 'Product Features', emoji: '🎯' },
    ],
    'Social Proof': [
      { text: 'Más Vendido', category: 'Social Proof', emoji: '🏆' },
      { text: 'Calificación 5 Estrellas', category: 'Social Proof', emoji: '⭐' },
      { text: 'Elección del Cliente', category: 'Social Proof', emoji: '👥' },
      { text: 'Confiado por Miles', category: 'Social Proof', emoji: '🤝' },
      { text: '#1 en el Mercado', category: 'Social Proof', emoji: '📈' },
    ],
    'Cash & Delivery': [
      { text: 'Envío Gratis', category: 'Cash & Delivery', emoji: '🚚' },
      { text: 'Pago Contra Entrega Disponible', category: 'Cash & Delivery', emoji: '💰' },
      { text: 'Paga Solo al Recibir', category: 'Cash & Delivery', emoji: '📦' },
      { text: 'Entrega a Domicilio - Paga al Recibir', category: 'Cash & Delivery', emoji: '🏠' },
      {
        text: 'Tu Dinero Está Seguro - Paga en la Entrega',
        category: 'Cash & Delivery',
        emoji: '🔒',
      },
      { text: 'Sin Pago por Adelantado', category: 'Cash & Delivery', emoji: '💳' },
      { text: 'Pago Seguro en la Entrega', category: 'Cash & Delivery', emoji: '✅' },
      { text: 'Prueba Primero, Paga Después', category: 'Cash & Delivery', emoji: '👀' },
      { text: 'Pago Contra Entrega en Todo el País', category: 'Cash & Delivery', emoji: '🌍' },
      { text: 'Recíbelo Hoy, Paga en la Entrega', category: 'Cash & Delivery', emoji: '⚡' },
    ],
    'Call to Action': [
      { text: 'Compra Ahora', category: 'Call to Action', emoji: '🛍️' },
      { text: 'Más Información', category: 'Call to Action', emoji: '📚' },
      { text: 'Empieza Ya', category: 'Call to Action', emoji: '🚀' },
      { text: 'Regístrate', category: 'Call to Action', emoji: '✍️' },
      { text: 'Reserva Ahora', category: 'Call to Action', emoji: '📅' },
    ],
    Promotions: [
      { text: 'Oferta Limitada', category: 'Promotions', emoji: '⏰' },
      { text: 'Oferta Exclusiva', category: 'Promotions', emoji: '💎' },
      { text: 'Descuento Especial', category: 'Promotions', emoji: '🏷️' },
      { text: 'Grandes Ahorros', category: 'Promotions', emoji: '💰' },
      { text: 'Mejor Precio', category: 'Promotions', emoji: '🌟' },
    ],
    Urgency: [
      { text: 'Hasta Agotar Stock', category: 'Urgency', emoji: '📦' },
      { text: 'Stock Limitado', category: 'Urgency', emoji: '⚡' },
      { text: 'No Te Lo Pierdas', category: 'Urgency', emoji: '🎯' },
      { text: 'Actúa Ahora', category: 'Urgency', emoji: '🏃' },
      { text: 'Última Oportunidad', category: 'Urgency', emoji: '⌛' },
    ],
  },
};
