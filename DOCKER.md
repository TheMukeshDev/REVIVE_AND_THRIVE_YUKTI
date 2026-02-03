# Docker Deployment Guide

## Quick Start

### Build and Run with Docker

```bash
# Build the image
docker build -t ecodrop:latest .

# Run the container
docker run -p 3000:3000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_api_key" \
  ecodrop:latest
```

### Using Docker Compose (Recommended)

1. Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecodrop
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

2. Run with docker-compose:

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Production Deployment

### Deploy to Cloud Run (Google Cloud)

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ecodrop

# Deploy to Cloud Run
gcloud run deploy ecodrop \
  --image gcr.io/YOUR_PROJECT_ID/ecodrop \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="your_uri",NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_key"
```

### Deploy to AWS ECS

```bash
# Build and tag
docker build -t ecodrop:latest .
docker tag ecodrop:latest YOUR_ECR_REPO:latest

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_REPO
docker push YOUR_ECR_REPO:latest

# Deploy using ECS task definition
```

### Deploy to Railway

```bash
# Railway automatically detects Dockerfile
railway up
```

## Image Optimization

The Dockerfile uses multi-stage builds to minimize image size:

- **Base image**: node:18-alpine (~40MB)
- **Final image**: ~150MB (optimized)
- **Build time**: ~2-3 minutes

## Environment Variables

Required environment variables:

- `MONGODB_URI` - MongoDB connection string
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `NODE_ENV` - Set to `production`

## Health Check

Add this to your docker-compose.yml for health monitoring:

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Troubleshooting

**Container exits immediately:**
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check logs: `docker logs <container_id>`

**Port already in use:**
```bash
# Use a different port
docker run -p 8080:3000 ecodrop:latest
```

**Build fails:**
- Ensure you have enough disk space
- Clear Docker cache: `docker system prune -a`
- Check Node version compatibility

## Performance Tips

1. **Use build cache**: Docker will cache layers for faster rebuilds
2. **Multi-stage builds**: Already implemented to reduce image size
3. **Non-root user**: Security best practice already implemented
4. **Resource limits**: Add to docker-compose.yml:

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
```

That's it! Your EcoDrop app should now be running in Docker.
