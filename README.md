# EcoDrop – Smart E-Waste Recycling Platform

> Making e-waste recycling actually convenient.

## What's This About?

We built EcoDrop because recycling e-waste is way harder than it should be. Most people want to recycle their old phones and batteries, but they don't know where to go, and honestly, it's just not worth the hassle. So we made an app that fixes that.

## The Problem We're Solving

E-waste is growing faster than any other type of waste, but less than 20% of it gets recycled. Why? Three main reasons:

1. **Nobody knows where the bins are** – You can't recycle if you can't find a bin
2. **Trust issues** – How do you know your stuff actually gets recycled?
3. **Zero motivation** – Why go out of your way when there's no benefit?

## Our Solution

EcoDrop is basically Google Maps for recycling bins, with some gamification thrown in. We started in Prayagraj (our hometown) and built it to work in other cities too.

### What It Does

- **Find bins near you** – Real-time map showing which bins are operational, full, or under maintenance
- **AI verification** – Scan your item, get instant confirmation it's recyclable
- **Earn rewards** – Get points for every drop, redeem them for eco-friendly stuff
- **Track your impact** – See how much CO₂ you've saved
- **Multi-city support** – Works in Prayagraj now, expanding soon

## How It Works

1. Pick what you want to recycle
2. App shows you the nearest bin
3. Navigate there (we integrate with Google Maps)
4. Scan your item at the bin
5. Drop it in when verified
6. Earn points and see your impact

Pretty straightforward.

## Tech Stack

We kept it simple but modern:

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + Framer Motion for animations
- **Backend**: Next.js API routes
- **Database**: MongoDB (using Mongoose)
- **Maps**: Google Maps Platform
- **AI**: Custom verification logic (ready for ML integration)

The whole thing runs serverless, so it scales easily.

## Database Structure

We're using MongoDB with these main collections:

- **Users** – Profiles, points, stats
- **Bins** – Locations, status, fill levels
- **Transactions** – Every recycling event (immutable log)
- **Rewards** – Stuff you can redeem
- **DetectionLogs** – AI scan history for training

## Getting Started

### You'll Need

- Node.js 18 or higher
- MongoDB (local or Atlas)
- Google Maps API key

### Setup

```bash
# Clone it
git clone https://github.com/TheMukeshDev/EcoDrop.git
cd EcoDrop

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
# MONGODB_URI=your_mongodb_connection_string
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Seed the database with demo data
npx tsx scripts/seed.ts

# Run it
npm run dev
```

Open http://localhost:3000 and you're good to go.

## Features We're Proud Of

### Location Stuff
- Uses your GPS to find the closest bin
- Falls back gracefully if you deny location access
- Haversine formula for accurate distance calculations
- Auto-routes to nearest bin on page load

### Verification System
- Confidence scores for every scan
- High confidence (>85%) = instant approval
- Low confidence = manual review or user selection
- Full transparency on what was detected and why

### UX Details
- Dark mode (with a toggle in the header now)
- Mobile-first design
- Smooth animations that don't feel janky
- Bottom nav like Instagram/Uber – familiar and easy

### Performance
- Throttled location updates (no battery drain)
- Optimized map rendering
- Lazy loading where it makes sense

## Multi-City Support

We built this for Prayagraj first, but it's designed to work anywhere. The app detects your city and shows available bins. If your city isn't supported yet, you get a "Coming Soon" screen where you can request it.

Currently supported:
- Prayagraj (Allahabad)

Coming soon:
- Your city? Let us know!

## What's Next

Some things we want to add:

- **Predictive analytics** – Predict when bins will be full
- **Real IoT integration** – Actually connect to physical smart bins
- **More cities** – Expand beyond Prayagraj
- **Better AI** – Train actual ML models on real data
- **Social features** – Leaderboards, challenges, etc.

## Built For Haxplore

This was our submission for the Haxplore hackathon. We focused on making something that actually works and feels good to use, not just a tech demo.

**Team Binary Bloom:**
- Mukesh Kumar – Built most of it, led the team
- Deepa Tiwari – Presented to judges
- Ankit Kumar – Frontend work

## License

MIT – do whatever you want with it.

---

Built with ❤️ (and way too much coffee) in Prayagraj.

Questions? Hit us up or open an issue.
