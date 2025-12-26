import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

const DEMO_RESOURCES: Record<string, any> = {
  'apify/instagram-scraper': {
    id: 'apify/instagram-scraper',
    name: 'Instagram Scraper',
    description: 'Extract posts, profiles, hashtags, and comments from Instagram',
    category: 'social',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'Instagram username to scrape' },
        hashtag: { type: 'string', description: 'Hashtag to search (without #)' },
        maxPosts: { type: 'integer', description: 'Maximum posts to extract', default: 100 },
      },
    },
  },
  'apify/twitter-scraper': {
    id: 'apify/twitter-scraper',
    name: 'Twitter/X Scraper',
    description: 'Gather tweets, user profiles, followers, and trending topics',
    category: 'social',
    inputSchema: {
      type: 'object',
      properties: {
        searchQuery: { type: 'string', description: 'Search query or username' },
        maxTweets: { type: 'integer', description: 'Maximum tweets to extract', default: 100 },
        includeReplies: { type: 'boolean', description: 'Include replies', default: false },
      },
    },
  },
  'apify/google-maps-scraper': {
    id: 'apify/google-maps-scraper',
    name: 'Google Maps Scraper',
    description: 'Extract business listings, reviews, and location data from Google Maps',
    category: 'maps',
    inputSchema: {
      type: 'object',
      properties: {
        searchQuery: { type: 'string', description: 'Business type or name to search' },
        location: { type: 'string', description: 'City or area to search in' },
        maxResults: { type: 'integer', description: 'Maximum results', default: 100 },
      },
    },
  },
  'apify/amazon-scraper': {
    id: 'apify/amazon-scraper',
    name: 'Amazon Product Scraper',
    description: 'Scrape product details, prices, reviews, and seller information',
    category: 'ecommerce',
    inputSchema: {
      type: 'object',
      properties: {
        searchQuery: { type: 'string', description: 'Product search query' },
        category: { type: 'string', description: 'Amazon category' },
        maxProducts: { type: 'integer', description: 'Maximum products', default: 100 },
      },
    },
  },
  'apify/web-scraper': {
    id: 'apify/web-scraper',
    name: 'Universal Web Scraper',
    description: 'Extract data from any website with custom selectors',
    category: 'web',
    inputSchema: {
      type: 'object',
      properties: {
        startUrls: { type: 'array', description: 'URLs to scrape (one per line)' },
        maxPages: { type: 'integer', description: 'Maximum pages to crawl', default: 10 },
      },
      required: ['startUrls'],
    },
  },
  'apify/google-search-scraper': {
    id: 'apify/google-search-scraper',
    name: 'Google Search Scraper',
    description: 'Scrape Google search results, ads, and related queries',
    category: 'search',
    inputSchema: {
      type: 'object',
      properties: {
        queries: { type: 'array', description: 'Search queries (one per line)' },
        maxResults: { type: 'integer', description: 'Results per query', default: 10 },
      },
      required: ['queries'],
    },
  },
  'apify/youtube-scraper': {
    id: 'apify/youtube-scraper',
    name: 'YouTube Scraper',
    description: 'Extract video details, comments, channel info, and transcripts',
    category: 'media',
    inputSchema: {
      type: 'object',
      properties: {
        searchQuery: { type: 'string', description: 'Search query or channel URL' },
        maxVideos: { type: 'integer', description: 'Maximum videos', default: 50 },
        includeComments: { type: 'boolean', description: 'Include comments', default: false },
      },
    },
  },
  'apify/linkedin-scraper': {
    id: 'apify/linkedin-scraper',
    name: 'LinkedIn Scraper',
    description: 'Gather company profiles, job listings, and professional data',
    category: 'social',
    inputSchema: {
      type: 'object',
      properties: {
        companyUrl: { type: 'string', description: 'LinkedIn company URL' },
        jobSearch: { type: 'string', description: 'Job title to search' },
        location: { type: 'string', description: 'Location filter' },
      },
    },
  },
  'apify/tiktok-scraper': {
    id: 'apify/tiktok-scraper',
    name: 'TikTok Scraper',
    description: 'Extract videos, user profiles, hashtags, and engagement metrics',
    category: 'social',
    inputSchema: {
      type: 'object',
      properties: {
        hashtag: { type: 'string', description: 'Hashtag to search (without #)' },
        username: { type: 'string', description: 'TikTok username' },
        maxVideos: { type: 'integer', description: 'Maximum videos', default: 100 },
      },
    },
  },
  'apify/yelp-scraper': {
    id: 'apify/yelp-scraper',
    name: 'Yelp Scraper',
    description: 'Scrape business reviews, ratings, and local business data',
    category: 'maps',
    inputSchema: {
      type: 'object',
      properties: {
        searchQuery: { type: 'string', description: 'Business type to search' },
        location: { type: 'string', description: 'City or area' },
        maxResults: { type: 'integer', description: 'Maximum results', default: 100 },
      },
    },
  },
  'apify/tripadvisor-scraper': {
    id: 'apify/tripadvisor-scraper',
    name: 'TripAdvisor Scraper',
    description: 'Extract hotel reviews, restaurant ratings, and travel data',
    category: 'maps',
    inputSchema: {
      type: 'object',
      properties: {
        searchQuery: { type: 'string', description: 'Hotel or restaurant name' },
        location: { type: 'string', description: 'Destination' },
        maxResults: { type: 'integer', description: 'Maximum results', default: 50 },
      },
    },
  },
  'apify/ebay-scraper': {
    id: 'apify/ebay-scraper',
    name: 'eBay Scraper',
    description: 'Gather auction listings, prices, and seller information',
    category: 'ecommerce',
    inputSchema: {
      type: 'object',
      properties: {
        searchQuery: { type: 'string', description: 'Product search query' },
        maxItems: { type: 'integer', description: 'Maximum items', default: 100 },
        auctionOnly: { type: 'boolean', description: 'Only auctions', default: false },
      },
    },
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = decodeURIComponent(params.id)

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    // Check demo resources first
    const demoResource = DEMO_RESOURCES[resourceId]
    if (demoResource) {
      return NextResponse.json({
        success: true,
        resource: demoResource,
        demo: true,
      })
    }

    // Try real API if configured
    if (resourceGateway.isConfigured()) {
      const resource = await resourceGateway.getResourceDetails(resourceId)
      return NextResponse.json({
        success: true,
        resource: {
          id: resource.id,
          name: resource.name,
          description: resource.description,
          category: resource.category,
          inputSchema: resource.inputSchema,
        },
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Resource not found'
    }, { status: 404 })
  } catch (error: any) {
    console.error('Resource details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resource details', details: error.message },
      { status: 500 }
    )
  }
}
