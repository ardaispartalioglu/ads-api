const { ApifyClient } = require('apify-client');

/**
 * TikTok Ads Scraper Service
 * Uses Apify's silva95gustavo/tiktok-ads-scraper actor
 */
class TikTokService {
  constructor() {
    this.apiToken = process.env.APIFY_API_TOKEN;
    this.actorId = process.env.APIFY_TIKTOK_ACTOR_ID || 'silva95gustavo/tiktok-ads-scraper';
    
    if (!this.apiToken || this.apiToken === 'your_apify_token_here') {
      console.warn('⚠️  APIFY_API_TOKEN not configured. TikTok scraper will return dummy data.');
      this.isConfigured = false;
    } else {
      this.client = new ApifyClient({ token: this.apiToken });
      this.isConfigured = true;
    }
  }

  /**
   * Fetch TikTok ads data
   * @param {Object} params - Search parameters
   * @param {string} params.search_term - Keyword to search
   * @param {string} params.country - Country code (e.g., 'TR')
   * @param {string} params.date_from - Start date
   * @param {string} params.date_to - End date
   * @param {number} params.limit - Max results
   * @returns {Promise<Array>} Array of ads in unified format
   */
  async fetchAds(params) {
    const {
      search_term = '',
      country = 'TR',
      date_from,
      date_to,
      limit = 10
    } = params;

    // Return dummy data if not configured
    if (!this.isConfigured) {
      return this.getDummyData(params);
    }

    try {
      // Prepare Apify actor input according to silva95gustavo/tiktok-ads-scraper requirements
      const input = {
        startUrls: [
          {
            url: `https://library.tiktok.com/ads?keyword=${encodeURIComponent(search_term)}&region=${country}`
          }
        ],
        maxItems: limit
      };

      console.log('🎵 Calling Apify TikTok Ads Scraper with input:', input);

      // Run the actor and wait for it to finish
      const run = await this.client.actor(this.actorId).call(input);

      // Fetch results from the dataset
      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

      console.log(`✅ Retrieved ${items.length} TikTok ads`);

      // Transform to unified format
      return items.map(ad => this.transformToUnifiedFormat(ad, params));

    } catch (error) {
      console.error('Error fetching TikTok ads:', error);
      throw new Error(`TikTok scraper failed: ${error.message}`);
    }
  }

  /**
   * Transform Apify result to unified schema
   */
  transformToUnifiedFormat(ad, originalParams) {
    return {
      platform: 'tiktok',
      ad_id: ad.id || ad.adId || `tiktok_${Date.now()}`,
      advertiser_name: ad.advertiserName || ad.brandName || 'Unknown Advertiser',
      impressions: {
        lower: ad.impressions?.min || ad.viewsMin || 0,
        upper: ad.impressions?.max || ad.viewsMax || 0
      },
      countries: ad.countries || [originalParams.country || 'TR'],
      start_date: ad.startDate || ad.publishedDate || originalParams.date_from || new Date().toISOString().split('T')[0],
      end_date: ad.endDate || originalParams.date_to || new Date().toISOString().split('T')[0],
      media_url: ad.videoUrl || ad.mediaUrl || '',
      thumbnail_url: ad.thumbnailUrl || ad.coverImageUrl || '',
      targeting: {
        genders: ad.targeting?.genders || ad.genders || ['all'],
        age_ranges: ad.targeting?.ageRanges || ad.ageRanges || ['18-65+']
      },
      search_term_used: originalParams.search_term || '',
      limit_used: originalParams.limit || 10,
      // Extra TikTok-specific fields
      raw_data: {
        likes: ad.likes || 0,
        comments: ad.comments || 0,
        shares: ad.shares || 0,
        caption: ad.caption || ad.description || ''
      }
    };
  }

  /**
   * Generate dummy data when API is not configured
   */
  getDummyData(params) {
    const { search_term = '', country = 'TR', limit = 10 } = params;
    const dummyAds = [];

    for (let i = 1; i <= Math.min(limit, 10); i++) {
      dummyAds.push({
        platform: 'tiktok',
        ad_id: `dummy_tiktok_${i}`,
        advertiser_name: `TikTok Advertiser ${i}`,
        impressions: {
          lower: 1000 * i,
          upper: 5000 * i
        },
        countries: [country],
        start_date: params.date_from || '2025-11-01',
        end_date: params.date_to || '2025-11-18',
        media_url: `https://example.com/tiktok-video-${i}.mp4`,
        thumbnail_url: `https://example.com/tiktok-thumb-${i}.jpg`,
        targeting: {
          genders: i % 2 === 0 ? ['male', 'female'] : ['female'],
          age_ranges: ['18-24', '25-34']
        },
        search_term_used: search_term,
        limit_used: limit,
        raw_data: {
          likes: 1000 * i,
          comments: 50 * i,
          shares: 20 * i,
          caption: `Sample TikTok ad ${i} for ${search_term || 'general'}`
        }
      });
    }

    return dummyAds;
  }
}

module.exports = new TikTokService();
