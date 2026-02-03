# Deployment Guide

Quick guide to getting EcoDrop running in production.

## Pre-Deployment Checklist

Before you deploy, make sure you have:

- [ ] MongoDB database set up (Atlas recommended)
- [ ] Google Maps API key with billing enabled
- [ ] Environment variables configured
- [ ] Seed data loaded (optional but recommended for demo)

## Environment Variables

Create these in your deployment platform:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecodrop

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# Optional: For production optimizations
NODE_ENV=production
```

## Platform-Specific Guides

### Vercel (Recommended)

Easiest option since we're using Next.js:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or just connect your GitHub repo in the Vercel dashboard. It'll auto-deploy on push.

**Important**: Add environment variables in Project Settings → Environment Variables

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
netlify deploy --prod
```

Build settings:
- Build command: `npm run build`
- Publish directory: `.next`

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

Railway auto-detects Next.js and handles the rest.

### Docker (Self-Hosted)

We don't have a Dockerfile yet, but here's what you'd need:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Post-Deployment

### Verify Everything Works

1. Open your deployed URL
2. Check if the map loads
3. Try finding a bin
4. Test the scan flow
5. Check dark mode toggle
6. Verify theme persists on reload

### Common Issues

**Map not loading?**
- Check if your Google Maps API key is set correctly
- Make sure billing is enabled on Google Cloud
- Verify the API key has Maps JavaScript API enabled

**Database connection failing?**
- Double-check your MongoDB URI
- Ensure your IP is whitelisted in MongoDB Atlas
- Check if the database user has correct permissions

**Theme not persisting?**
- Make sure localStorage isn't blocked
- Check browser console for errors
- Verify ThemeProvider is wrapping the app

## Performance Tips

### For Production

1. **Enable caching** – Next.js handles most of this automatically
2. **Optimize images** – Use Next.js Image component (we already do)
3. **Monitor bundle size** – Run `npm run build` and check the output
4. **Set up analytics** – Add Vercel Analytics or Google Analytics if needed

### Database Indexes

Make sure these indexes exist in MongoDB:

```javascript
// Bins collection
db.bins.createIndex({ location: "2dsphere" })  // For geo queries
db.bins.createIndex({ city: 1, status: 1 })    // For city filtering

// Transactions collection
db.transactions.createIndex({ userId: 1, createdAt: -1 })
db.transactions.createIndex({ binId: 1 })

// Users collection
db.users.createIndex({ email: 1 }, { unique: true })
```

## Monitoring

### What to Watch

- **API response times** – Should be under 200ms for most endpoints
- **Database queries** – Watch for slow queries in MongoDB Atlas
- **Error rates** – Set up error tracking (Sentry works well)
- **User location errors** – Common when GPS is denied

### Logs

Check these if something breaks:

- Vercel: Dashboard → Deployments → Functions
- Netlify: Dashboard → Functions
- Railway: Dashboard → Deployments → Logs

## Scaling Considerations

If you get a lot of users:

1. **Database**: MongoDB Atlas auto-scales, but watch your tier limits
2. **API routes**: Serverless functions scale automatically
3. **Maps API**: Watch your quota (can get expensive)
4. **CDN**: Vercel/Netlify handle this automatically

## Security Notes

- Never commit `.env.local` to git (it's in .gitignore already)
- Rotate API keys if they leak
- Use environment variables for all secrets
- Enable CORS only for your domain in production

## Rollback Plan

If something breaks:

**Vercel**: Dashboard → Deployments → Click previous deployment → Promote to Production

**Netlify**: Dashboard → Deploys → Click previous deploy → Publish deploy

**Railway**: Dashboard → Deployments → Rollback button

## Support

If you run into issues:

1. Check the logs first
2. Search existing GitHub issues
3. Open a new issue with:
   - What you tried to deploy
   - Error messages
   - Platform you're using

---

That's it. Should take about 10 minutes to deploy if everything's set up right.

Good luck! 🚀
