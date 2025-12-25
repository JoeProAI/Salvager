# Salvager

**Resource Gathering & Data Supply Platform**

Salvager is a powerful resource acquisition system that connects your applications to vast data sources across the web. It provides a unified interface for gathering, processing, and supplying structured data to your downstream applications.

## Features

- **Resource Discovery** - Find and catalog data sources across social platforms, search engines, maps, and e-commerce sites
- **Data Extraction** - Gather structured data from any web resource
- **Pipeline Management** - Create automated data gathering workflows
- **Real-time Monitoring** - Track resource acquisition status and logs
- **Storage Integration** - Store and retrieve gathered resources via Firebase

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your credentials
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables

| Variable | Description |
|----------|-------------|
| `RESOURCE_GATEWAY_TOKEN` | API token for resource gateway access |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client configuration |
| `FIREBASE_ADMIN_*` | Firebase Admin SDK credentials |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Salvager                           │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Discovery  │  │  Gathering  │  │   Storage   │     │
│  │   Engine    │  │   Workers   │  │   Manager   │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│         └────────────────┼────────────────┘             │
│                          │                              │
│              ┌───────────▼───────────┐                  │
│              │   Resource Gateway    │                  │
│              │   (MCP Integration)   │                  │
│              └───────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

## License

MIT
