const axios = require('axios');

/**
 * Meta Ad Library Service
 * Uses Meta's Graph API to fetch ad library data
 * Docs: https://developers.facebook.com/docs/graph-api/reference/ads_archive/
 */
class MetaService {
  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN;
    this.apiVersion = process.env.META_API_VERSION || 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    
    if (!this.accessToken || this.accessToken === 'your_meta_access_token_here') {
      console.warn('⚠️  META_ACCESS_TOKEN not configured. Meta service will return dummy data.');
      this.isConfigured = false;
    } else {
      this.isConfigured = true;
    }
  }

  /**
   * Fetch Meta ads from Ad Library
   * @param {Object} params - Search parameters
   * @param {string} params.search_term - Keyword to search
   * @param {string} params.country - Country code (e.g., 'TR')
   * @param {string} params.ad_type - Ad type filter ('ALL', 'POLITICAL_AND_ISSUE_ADS', etc.)
   * @param {number} params.limit - Max results
   * @returns {Promise<Array>} Array of ads in unified format
   */
  async fetchAds(params) {
    const {
      search_term = '',
      country = 'TR',
      ad_type = 'ALL',
      limit = 10
    } = params;

    // Return dummy data if not configured
    if (!this.isConfigured) {
      return this.getDummyData(params);
    }

    try {
      // Meta Ad Library API endpoint
      const endpoint = `${this.baseUrl}/ads_archive`;

      // Prepare query parameters
      const queryParams = {
        access_token: this.accessToken,
        search_terms: search_term,
        ad_reached_countries: `['${country}']`,
        ad_type: ad_type,
        limit: limit,
        fields: 'id,ad_creation_time,ad_creative_bodies,ad_creative_link_captions,ad_creative_link_descriptions,ad_creative_link_titles,ad_delivery_start_time,ad_delivery_stop_time,ad_snapshot_url,currency,demographic_distribution,impressions,page_id,page_name,publisher_platforms,spend'
      };

      console.log('📘 Calling Meta Ad Library API with params:', {
        search_term,
        country,
        ad_type,
        limit
      });

      // Make API request
      const response = await axios.get(endpoint, { params: queryParams });

      const ads = response.data.data || [];
      console.log(`✅ Retrieved ${ads.length} Meta ads`);

      // Transform to unified format
      return ads.map(ad => this.transformToUnifiedFormat(ad, params));

    } catch (error) {
      console.error('Error fetching Meta ads:', error.response?.data || error.message);
      
      // If rate limited or auth error, provide helpful message
      if (error.response?.status === 429) {
        throw new Error('Meta API rate limit exceeded. Please try again later.');
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Meta API authentication failed. Check your access token.');
      }
      
      throw new Error(`Meta Ad Library failed: ${error.message}`);
    }
  }

  /**
   * Transform Meta Ad Library result to unified schema
   */
  transformToUnifiedFormat(ad, originalParams) {
    // Parse impressions (Meta returns ranges like "1,000-5,000")
    const impressionsData = this.parseImpressions(ad.impressions);
    
    // Extract demographic data
    const demographics = ad.demographic_distribution ? 
      this.parseDemographics(ad.demographic_distribution) : 
      { genders: ['all'], age_ranges: ['18-65+'] };

    return {
      platform: 'meta',
      ad_id: ad.id || `meta_${Date.now()}`,
      page_id: ad.page_id || '',
      page_name: ad.page_name || 'Unknown Page',
      impressions: impressionsData,
      countries: [originalParams.country || 'TR'],
      start_date: ad.ad_delivery_start_time || ad.ad_creation_time || new Date().toISOString().split('T')[0],
      end_date: ad.ad_delivery_stop_time || new Date().toISOString().split('T')[0],
      media_url: ad.ad_snapshot_url || '',
      thumbnail_url: ad.ad_snapshot_url || '', // Meta doesn't provide separate thumbnail
      targeting: demographics,
      ad_type_used: originalParams.ad_type || 'ALL',
      search_term_used: originalParams.search_term || '',
      limit_used: originalParams.limit || 10,
      // Extra Meta-specific fields
      raw_data: {
        creative_body: ad.ad_creative_bodies?.[0] || '',
        link_caption: ad.ad_creative_link_captions?.[0] || '',
        link_description: ad.ad_creative_link_descriptions?.[0] || '',
        link_title: ad.ad_creative_link_titles?.[0] || '',
        currency: ad.currency || 'USD',
        spend: ad.spend || { lower_bound: 0, upper_bound: 0 },
        platforms: ad.publisher_platforms || []
      }
    };
  }

  /**
   * Parse Meta's impression format
   */
  parseImpressions(impressionsStr) {
    if (!impressionsStr) {
      return { lower: 0, upper: 0 };
    }

    // Meta format: "1,000-5,000" or single value
    if (typeof impressionsStr === 'string') {
      const cleaned = impressionsStr.replace(/,/g, '');
      if (cleaned.includes('-')) {
        const [lower, upper] = cleaned.split('-').map(Number);
        return { lower, upper };
      }
      const value = Number(cleaned);
      return { lower: value, upper: value };
    }

    // If it's an object with lower_bound/upper_bound
    if (typeof impressionsStr === 'object') {
      return {
        lower: impressionsStr.lower_bound || 0,
        upper: impressionsStr.upper_bound || 0
      };
    }

    return { lower: 0, upper: 0 };
  }

  /**
   * Parse demographic distribution
   */
  parseDemographics(distribution) {
    if (!Array.isArray(distribution) || distribution.length === 0) {
      return { genders: ['all'], age_ranges: ['18-65+'] };
    }

    const genders = new Set();
    const ageRanges = new Set();

    distribution.forEach(demo => {
      if (demo.gender) genders.add(demo.gender.toLowerCase());
      if (demo.age) ageRanges.add(demo.age);
    });

    return {
      genders: genders.size > 0 ? Array.from(genders) : ['all'],
      age_ranges: ageRanges.size > 0 ? Array.from(ageRanges) : ['18-65+']
    };
  }

  /**
   * Generate dummy data when API is not configured
   */
  getDummyData(params) {
    const { search_term = '', country = 'TR', ad_type = 'ALL', limit = 10 } = params;
    const dummyAds = [];

    for (let i = 1; i <= Math.min(limit, 10); i++) {
      dummyAds.push({
        platform: 'meta',
        ad_id: `dummy_meta_${i}`,
        page_id: `${123456 + i}`,
        page_name: `Meta Page ${i}`,
        impressions: {
          lower: 500 * i,
          upper: 3000 * i
        },
        countries: [country],
        start_date: '2025-11-01',
        end_date: '2025-11-18',
        media_url: i % 3 === 0 
          ? `https://example.com/meta-video-${i}.mp4`
          : `https://example.com/meta-image-${i}.jpg`,
        thumbnail_url: `https://example.com/meta-thumb-${i}.jpg`,
        targeting: {
          genders: i % 2 === 0 ? ['all'] : ['male', 'female'],
          age_ranges: ['18-65+']
        },
        ad_type_used: ad_type,
        search_term_used: search_term,
        limit_used: limit,
        raw_data: {
          creative_body: `Sample Meta ad ${i} about ${search_term || 'general topic'}`,
          link_caption: `Learn more about ${search_term || 'this'}`,
          link_description: 'Click to see details',
          link_title: `Ad Title ${i}`,
          currency: 'USD',
          spend: { lower_bound: 100 * i, upper_bound: 500 * i },
          platforms: ['facebook', 'instagram']
        }
      });
    }

    return dummyAds;
  }
}

module.exports = new MetaService();
