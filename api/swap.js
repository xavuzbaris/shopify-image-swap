export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shop, token, productId } = req.body;

  if (!shop || !token || !productId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const productRes = await fetch(
      `https://${shop}/admin/api/2024-01/products/${productId}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
      }
    );

    const productData = await productRes.json();
    const images = productData.product.images;

    if (images.length < 2) {
      return res.status(400).json({ error: 'Product needs at least 2 images' });
    }

    const firstImage = images[0];
    const secondImage = images[1];

    await fetch(
      `https://${shop}/admin/api/2024-01/products/${productId}/images/${secondImage.id}.json`,
      {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: { id: secondImage.id, position: 1 } }),
      }
    );

    await fetch(
      `https://${shop}/admin/api/2024-01/products/${productId}/images/${firstImage.id}.json`,
      {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: { id: firstImage.id, position: 2 } }),
      }
    );

    return res.status(200).json({ success: true, productId });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
