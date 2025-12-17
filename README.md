# Shopify Image Swap

Swap first and second product images with one click. Free hosting on Vercel.

## Quick Deploy (2 minutes)

### Step 1: Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/shopify-image-swap)

Or manually:

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click "Add New Project"
3. Upload this folder OR connect your GitHub
4. Click "Deploy"
5. Copy your app URL (e.g., `shopify-image-swap.vercel.app`)

### Step 2: Create Shopify App

1. Go to **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **Develop apps** → **Allow custom app development** (if first time)
3. Click **Create an app** → Name it "Image Swap" → **Create app**
4. Go to **Configuration** tab → **Admin API integration** → **Edit**
5. Select these scopes:
   - ✅ `read_products`
   - ✅ `write_products`
6. Click **Save**
7. Go to **API credentials** tab → **Install app** → **Install**
8. Click **Reveal token once** and copy it (only shown once!)

### Step 3: Use the App

1. Open your Vercel app URL
2. Enter your store URL: `your-store.myshopify.com`
3. Paste your Admin API Access Token
4. Click **Connect & Load Products**
5. Click **Swap All Images** or swap individual products

## Features

- ✅ Swap first and second images for all products
- ✅ Visual preview before swapping  
- ✅ Progress tracking for bulk operations
- ✅ Works with Shopify Basic plan
- ✅ Free hosting on Vercel
- ✅ No installation required

## How It Works

The app uses Shopify Admin API to:
1. Fetch all products with 2+ images
2. Update image positions (swap position 1 and 2)

Images are not deleted or modified - only their order changes.

## Reverting Changes

Run the swap again to restore original order.

## Rate Limits

Shopify Basic allows ~2 requests/second. The app automatically handles this with delays between operations.

## Security

- Your credentials are never stored on the server
- All API calls go directly from your browser to Shopify
- Open source - inspect the code yourself

## Troubleshooting

**"Unauthorized" error**
- Check your access token is correct
- Make sure the app is installed

**"Forbidden" error**  
- Verify `read_products` and `write_products` scopes are enabled

**Products not showing**
- Only products with 2+ images appear
- Try refreshing

## License

MIT - Use freely
