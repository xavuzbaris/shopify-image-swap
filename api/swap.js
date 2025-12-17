export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { shop, token, productId } = await req.json();

    if (!shop || !token || !productId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get product images
    const productResponse = await fetch(
      `https://${shop}/admin/api/2024-01/products/${productId}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!productResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch product' }), {
        status: productResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const productData = await productResponse.json();
    const images = productData.product.images;

    if (images.length < 2) {
      return new Response(JSON.stringify({ error: 'Product needs at least 2 images' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const firstImage = images[0];
    const secondImage = images[1];

    // Move second image to position 1
    await fetch(
      `https://${shop}/admin/api/2024-01/products/${productId}/images/${secondImage.id}.json`,
      {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: { id: secondImage.id, position: 1 }
        }),
      }
    );

    // Move first image to position 2
    await fetch(
      `https://${shop}/admin/api/2024-01/products/${productId}/images/${firstImage.id}.json`,
      {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: { id: firstImage.id, position: 2 }
        }),
      }
    );

    return new Response(JSON.stringify({ 
      success: true, 
      productId,
      message: 'Images swapped successfully'
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
