import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

const DEMO_RESOURCES = [
  {
    id: 'apify/instagram-scraper',
    name: 'Instagram Scraper',
    description: 'Extract posts, profiles, hashtags, and comments from Instagram',
    category: 'social',
  },
  {
    id: 'apify/twitter-scraper',
    name: 'Twitter/X Scraper',
    description: 'Gather tweets, user profiles, followers, and trending topics',
    category: 'social',
  },
  {
    id: 'apify/google-maps-scraper',
    name: 'Google Maps Scraper',
    description: 'Extract business listings, reviews, and location data from Google Maps',
    category: 'maps',
  },
  {
    id: 'apify/amazon-scraper',
    name: 'Amazon Product Scraper',
    description: 'Scrape product details, prices, reviews, and seller information',
    category: 'ecommerce',
  },
  {
    id: 'apify/web-scraper',
    name: 'Universal Web Scraper',
    description: 'Extract data from any website with custom selectors',
    category: 'web',
  },
  {
    id: 'apify/google-search-scraper',
    name: 'Google Search Scraper',
    description: 'Scrape Google search results, ads, and related queries',
    category: 'search',
  },
  {
    id: 'apify/youtube-scraper',
    name: 'YouTube Scraper',
    description: 'Extract video details, comments, channel info, and transcripts',
    category: 'media',
  },
  {
    id: 'apify/linkedin-scraper',
    name: 'LinkedIn Scraper',
    description: 'Gather company profiles, job listings, and professional data',
    category: 'social',
  },
  {
    id: 'apify/tiktok-scraper',
    name: 'TikTok Scraper',
    description: 'Extract videos, user profiles, hashtags, and engagement metrics',
    category: 'social',
  },
  {
    id: 'apify/yelp-scraper',
    name: 'Yelp Scraper',
    description: 'Scrape business reviews, ratings, and local business data',
    category: 'maps',
  },
  {
    id: 'apify/tripadvisor-scraper',
    name: 'TripAdvisor Scraper',
    description: 'Extract hotel reviews, restaurant ratings, and travel data',
    category: 'maps',
  },
  {
    id: 'apify/ebay-scraper',
    name: 'eBay Scraper',
    description: 'Gather auction listings, prices, and seller information',
    category: 'ecommerce',
  },
]

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 20 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // If gateway is configured, use real API
    if (resourceGateway.isConfigured()) {
      const resources = await resourceGateway.discoverResources(query, limit)
      return NextResponse.json({
        success: true,
        resources: resources.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          category: r.category || 'general',
          capabilities: r.capabilities || [],
        })),
      })
    }

    // Otherwise, filter demo resources by query
    const queryLower = query.toLowerCase()
    const filtered = DEMO_RESOURCES.filter(r => 
      r.name.toLowerCase().includes(queryLower) ||
      r.description.toLowerCase().includes(queryLower) ||
      r.category.toLowerCase().includes(queryLower)
    ).slice(0, limit)

    return NextResponse.json({
      success: true,
      resources: filtered,
      demo: true,
    })
  } catch (error: any) {
    console.error('Resource discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to discover resources', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '20')

  if (!query) {
    // Return all demo resources if no query
    return NextResponse.json({
      success: true,
      resources: DEMO_RESOURCES.slice(0, limit),
      demo: !resourceGateway.isConfigured(),
    })
  }

  try {
    if (resourceGateway.isConfigured()) {
      const resources = await resourceGateway.discoverResources(query, limit)
      return NextResponse.json({
        success: true,
        resources,
      })
    }

    // Filter demo resources
    const queryLower = query.toLowerCase()
    const filtered = DEMO_RESOURCES.filter(r => 
      r.name.toLowerCase().includes(queryLower) ||
      r.description.toLowerCase().includes(queryLower) ||
      r.category.toLowerCase().includes(queryLower)
    ).slice(0, limit)

    return NextResponse.json({
      success: true,
      resources: filtered,
      demo: true,
    })
  } catch (error: any) {
    console.error('Resource discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to discover resources', details: error.message },
      { status: 500 }
    )
  }
}
