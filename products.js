export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { searchParams } = new URL(req.url);
  const shop = searchParams.get('shop');
  const token = searchParams.get('token');

  if (!shop || !token) {
    return new Response(JSON.stringify({ error: 'Missing shop or token' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let allProducts = [];
    let url = `https://${shop}/admin/api/2024-01/products.json?limit=250`;

    while (url) {
      const response = await fetch(url, {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        return new Response(JSON.stringify({ error: `Shopify API error: ${response.status}` }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      allProducts = allProducts.concat(data.products);

      // Check for next page
      const linkHeader = response.headers.get('link');
      url = null;
      if (linkHeader) {
        const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        if (nextMatch) {
          url = nextMatch[1];
        }
      }
    }

    // Filter products with 2+ images
    const eligibleProducts = allProducts.filter(p => p.images && p.images.length >= 2);

    return new Response(JSON.stringify({
      total: allProducts.length,
      eligible: eligibleProducts.length,
      products: eligibleProducts.map(p => ({
        id: p.id,
        title: p.title,
        images: p.images.slice(0, 2).map(img => ({
          id: img.id,
          src: img.src,
          position: img.position
        }))
      }))
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
