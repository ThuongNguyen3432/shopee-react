import { useEffect } from 'react';

const SITE = 'Shopee Việt Nam';
const BASE = 'https://shopee.vn';
const DEFAULT_OG_IMAGE = 'https://picsum.photos/seed/shopeeog/1200/630';

function setMeta(name, content, attr = 'name') {
  if (content == null) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSEO({ title, description, keywords, image, url, type = 'website', jsonLd, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : `${SITE} | Mua Sắm Online`;
    document.title = fullTitle;

    setMeta('description', description || 'Shopee - Mua sắm online giá tốt, freeship, voucher mỗi ngày. Hàng triệu sản phẩm chính hãng.');
    setMeta('keywords', keywords || 'shopee, mua sắm online, thời trang, điện thoại, mỹ phẩm, đồ gia dụng');
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description || 'Shopee - Mua sắm online giá tốt, freeship, voucher mỗi ngày.', 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:site_name', SITE, 'property');
    setMeta('og:locale', 'vi_VN', 'property');
    setMeta('og:image', image || DEFAULT_OG_IMAGE, 'property');
    if (url) setMeta('og:url', url.startsWith('http') ? url : `${BASE}${url}`, 'property');

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:image', image || DEFAULT_OG_IMAGE);
    setMeta('twitter:description', description || 'Shopee - Mua sắm online giá tốt, freeship, voucher mỗi ngày.');

    // Canonical
    if (url) setLink('canonical', url.startsWith('http') ? url : `${BASE}${url}`);

    // JSON-LD
    if (jsonLd) setJsonLd('seo-jsonld', jsonLd);
    else setJsonLd('seo-jsonld', null);

    return () => {
      setJsonLd('seo-jsonld', null);
    };
  }, [title, description, keywords, image, url, type, jsonLd, noindex]);
}

export function productJsonLd(product) {
  if (!product) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.img || product.image,
    description: product.description || product.name,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Shopee' },
    offers: {
      '@type': 'Offer',
      url: `${BASE}/product/${product.id}`,
      priceCurrency: 'VND',
      price: product.price,
      availability: (product.stock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Shopee' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.5,
      reviewCount: product.sold || 0,
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url ? `${BASE}${it.url}` : undefined,
    })),
  };
}
