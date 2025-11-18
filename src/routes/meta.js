const express = require('express');
const router = express.Router();
const metaService = require('../services/metaService');

/**
 * POST /meta/ads
 * Fetch Meta (Facebook/Instagram) Ad Library data via Graph API
 * 
 * Request body parameters:
 * - search_term (string, optional): Search keyword
 * - country (string, optional, default: "TR"): Country code
 * - ad_type (string, optional, default: "ALL"): Ad type filter
 * - limit (number, optional, default: 10): Number of results
 */
router.post('/ads', async (req, res) => {
  try {
    // Extract parameters from request body
    const params = {
      search_term: req.body.search_term || '',
      country: req.body.country || 'TR',
      ad_type: req.body.ad_type || 'ALL',
      limit: parseInt(req.body.limit) || 10
    };

    console.log('📥 Meta ads request:', params);

    // Fetch ads via service
    const ads = await metaService.fetchAds(params);

    // Return unified response format
    res.status(200).json({
      success: true,
      source: metaService.isConfigured ? 'meta_graph_api' : 'meta_dummy',
      count: ads.length,
      params: params,
      data: ads
    });

  } catch (error) {
    console.error('❌ Error in /meta/ads:', error);
    res.status(500).json({
      success: false,
      source: 'meta_graph_api',
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
