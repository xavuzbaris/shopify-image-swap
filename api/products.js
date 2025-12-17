export default async function handler(req, res) {
  const { shop, token } = req.query;

  if (!shop || !token) {
    return res.status(400).json({ error: 'Missing shop or token' });
  }

  try {
    const response = await fetch(
      `https://${shop}/admin/api/2024-01/products.json?limit=250`,
      {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Shopify API error' });
    }

    const data = await response.json();
    const allProducts = data.products;
    const eligibleProducts = allProducts.filter(p => p.images && p.images.length >= 2);

    return res.status(200).json({
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
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
