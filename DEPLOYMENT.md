# 🚀 Deployment Guide - StacksYield

This guide walks through deploying StacksYield to production.

## Prerequisites

- GitHub account
- Vercel account
- Alchemy API key (for Ethereum RPC)
- Circle API key (for xReserve)
- Clarinet CLI installed (for smart contracts)

## Part 1: Deploy Smart Contracts

### Step 1: Install Clarinet

```bash
curl -L https://get.clarinet.sh | sh
```

### Step 2: Test Contracts

```bash
cd contracts
clarinet check
clarinet test
```

### Step 3: Deploy to Testnet

```bash
clarinet deploy --testnet
```

Save the contract address - you'll need it for frontend configuration.

### Step 4: Deploy to Mainnet

```bash
clarinet deploy --mainnet
```

**Important**: Update `.env.local` with the mainnet contract address.

## Part 2: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Push to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment Variables**

In Vercel dashboard, go to Settings → Environment Variables and add:

```env
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_ETHEREUM_CHAIN_ID=1
NEXT_PUBLIC_ALCHEMY_API_KEY=YOUR_ALCHEMY_KEY
NEXT_PUBLIC_STACKS_NETWORK=mainnet
NEXT_PUBLIC_STACKS_API_URL=https://api.mainnet.hiro.so
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
NEXT_PUBLIC_XRESERVE_CONTRACT_ADDRESS=YOUR_XRESERVE_ADDRESS
CIRCLE_API_KEY=YOUR_CIRCLE_API_KEY
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=StacksYield
```

4. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment

### Option B: Using Vercel CLI

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Login**

```bash
vercel login
```

3. **Deploy**

```bash
vercel --prod
```

4. **Set Environment Variables**

```bash
vercel env add NEXT_PUBLIC_ETHEREUM_RPC_URL
# Enter value when prompted
# Repeat for all variables
```

## Part 3: Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel Dashboard → Your Project
2. Click on "Settings" → "Domains"
3. Add your custom domain (e.g., stacksyield.com)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### Update Environment Variables

```bash
# Update APP_URL to your custom domain
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://stacksyield.com
```

## Part 4: Testing Production Deployment

### Checklist

- [ ] Homepage loads correctly
- [ ] Ethereum wallet connection works
- [ ] Stacks wallet connection works
- [ ] Bridge page functional
- [ ] Dashboard displays data
- [ ] API routes responding
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All links working

### Test Bridge Functionality

1. **Small Test Transaction**
   - Start with $10 USDC
   - Bridge from Ethereum to Stacks
   - Monitor transaction
   - Verify USDCx received

2. **Check Transaction History**
   - Verify transaction appears
   - Check status updates
   - Confirm etherscan links work

## Part 5: Monitoring & Analytics

### Add Analytics (Optional)

```bash
npm install @vercel/analytics
```

Update `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Monitor Errors

- Use Vercel's built-in error monitoring
- Check logs in Vercel dashboard
- Set up alerts for critical errors

## Part 6: Performance Optimization

### Enable Caching

Vercel automatically caches static assets. For API routes:

```typescript
// app/api/yields/route.ts
export const revalidate = 300; // Revalidate every 5 minutes
```

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={32} height={32} />
```

### Bundle Analysis

```bash
npm install @next/bundle-analyzer
```

## Part 7: Security Checklist

- [ ] All API keys in environment variables (not in code)
- [ ] `.env.local` in `.gitignore`
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Rate limiting on API routes
- [ ] Input validation everywhere
- [ ] Smart contracts audited (for mainnet)

## Part 8: Post-Deployment

### Update README

Update the live demo URL in README.md:

```markdown
**Live Demo**: https://your-domain.vercel.app
```

### Submit to DoraHacks

1. Update submission with live URL
2. Test all features one more time
3. Record demo video
4. Submit before deadline

### Share on Social Media

```text
🚀 Just launched StacksYield!

Bridge USDC between Ethereum and Stacks to access the best DeFi yields.

✅ Compare rates in real-time
✅ One-click bridging
✅ Smart recommendations

Try it: https://your-domain.vercel.app

Built for #StacksChallenge 🏆
```

## Troubleshooting

### Build Fails

**Error**: TypeScript errors

```bash
npm run build
# Fix any errors locally first
```

**Error**: Missing environment variables

- Check all required vars are set in Vercel
- Verify variable names match exactly

### Runtime Errors

**Error**: Wallet won't connect

- Check RPC URLs are correct
- Verify network IDs match
- Test with different wallet

**Error**: Bridge transaction fails

- Verify xReserve contract address
- Check USDC approval
- Ensure sufficient gas

### Performance Issues

**Slow API responses**

- Enable caching (see Part 6)
- Use CDN for static assets
- Optimize database queries

## Rollback Strategy

If production has issues:

1. **Quick Rollback**
   ```bash
   vercel rollback
   ```

2. **Specific Deployment**
   - Go to Vercel Dashboard → Deployments
   - Find last working deployment
   - Click "Promote to Production"

## Maintenance

### Regular Updates

- **Weekly**: Check for security updates
- **Monthly**: Review analytics
- **Quarterly**: Audit smart contracts

### Monitoring

- Set up uptime monitoring (e.g., UptimeRobot)
- Monitor transaction success rates
- Track user feedback

## Support

If you encounter issues:

1. Check [Vercel documentation](https://vercel.com/docs)
2. Check [Stacks documentation](https://docs.stacks.co)
3. Open an issue on GitHub
4. Contact: your.email@example.com

---

**Congratulations! Your StacksYield deployment is complete! 🎉**
