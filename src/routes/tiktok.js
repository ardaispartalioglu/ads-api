const express = require('express');
const router = express.Router();
const tiktokService = require('../services/tiktokService');

/**
 * POST /tiktok/ads
 * Fetch TikTok ads data via Apify scraper
 * 
 * Request body parameters:
 * - search_term (string, optional): Search keyword
 * - country (string, optional, default: "TR"): Country code
 * - date_from (string, optional): Start date
 * - date_to (string, optional): End date
 * - limit (number, optional, default: 10): Number of results
 */
router.post('/ads', async (req, res) => {
  try {
    // Extract parameters from request body
    const params = {
      search_term: req.body.search_term || '',
      country: req.body.country || 'TR',
      date_from: req.body.date_from || '2025-11-01',
      date_to: req.body.date_to || '2025-11-18',
      limit: parseInt(req.body.limit) || 10
    };

    console.log('📥 TikTok ads request:', params);

    // Fetch ads via service
    const ads = await tiktokService.fetchAds(params);

    // Return unified response format
    res.status(200).json({
      success: true,
      source: tiktokService.isConfigured ? 'tiktok_apify' : 'tiktok_dummy',
      count: ads.length,
      params: params,
      data: ads
    });

  } catch (error) {
    console.error('❌ Error in /tiktok/ads:', error);
    res.status(500).json({
      success: false,
      source: 'tiktok_apify',
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
