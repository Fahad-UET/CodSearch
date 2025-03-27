// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    const data = scrapePageData();
    sendResponse({ success: true, data });
  }
  return true;
});

function scrapePageData() {
  // Basic product data structure
  const data = {
    title: '',
    description: '',
    price: '',
    images: [],
    url: window.location.href,
    createdAt: new Date(),
  };

  // Title
  data.title = document.querySelector('h1')?.textContent?.trim() ||
               document.title.trim();

  // Description
  data.description = document.querySelector('meta[name="description"]')?.content ||
                    document.querySelector('.product-description')?.textContent?.trim() ||
                    '';

  // Price
  const priceElement = document.querySelector('[itemprop="price"], .price, .product-price');
  if (priceElement) {
    data.price = priceElement.textContent.trim().replace(/[^\d.,]/g, '');
  }

  // Images
  const images = Array.from(document.querySelectorAll('img')).filter(img => {
    const src = img.src || img.dataset.src;
    return src && 
           !src.includes('icon') && 
           !src.includes('logo') &&
           img.width > 100 && 
           img.height > 100;
  });

  data.images = images.map(img => ({
    url: img.src || img.dataset.src,
    alt: img.alt,
    width: img.width,
    height: img.height
  }));

  return data;
}