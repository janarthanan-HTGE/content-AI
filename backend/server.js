const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// JWT Secret
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// ==================== MIDDLEWARE ====================

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ detail: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      audience: 'authenticated'
    });

    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ detail: 'Invalid token' });
  }
};

// ==================== AI HELPER ====================

async function generateContentWithAI(prompt) {
  try {
    const response = await axios.post(
      'https://api.emergentagi.com/v1/chat/completions',
      {
        model: 'gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert marketing content creator. Generate highly relevant, engaging, and conversion-focused marketing content that directly relates to the product/service described. Be creative and specific.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.EMERGENT_LLM_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI generation error:', error.response?.data || error.message);
    throw new Error('AI content generation failed');
  }
}

async function generatePosterDesign(productDesc, category, tone) {
  const prompt = `
Product: ${productDesc}
Category: ${category}
Tone: ${tone}

Create a compelling poster design that directly showcases this specific product. Generate in JSON:
{
  "title": "Catchy headline directly about THIS product (max 6 words)",
  "subtitle": "Specific benefit of THIS product (max 10 words)",
  "main_text": "Key feature or unique selling point of THIS product (15-20 words)",
  "cta_text": "Action-oriented CTA (2-4 words like 'Get Yours Now', 'Order Today')",
  "color_scheme": "Suggest colors matching the product category",
  "layout_suggestion": "Describe visual layout for THIS specific product"
}
`;

  try {
    const response = await generateContentWithAI(prompt);
    const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Poster design error:', error.message);
    return {
      title: `${category} Special`,
      subtitle: 'Limited Time Offer',
      main_text: `Experience premium ${category} products`,
      cta_text: 'Shop Now',
      color_scheme: 'Modern and vibrant',
      layout_suggestion: 'Center-aligned with product focus'
    };
  }
}

// ==================== ROUTES ====================

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'CampaignAI API v2.0 (Node.js)' });
});

// Upload reference image
app.post('/api/storage/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No file uploaded' });
    }

    const fileExt = req.file.originalname.split('.').pop() || 'jpg';
    const filename = `${uuidv4()}.${fileExt}`;
    const filePath = `${req.userId}/${filename}`;

    const { data, error } = await supabase.storage
      .from('reference-images')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ detail: error.message });
    }

    const { data: publicUrlData } = supabase.storage
      .from('reference-images')
      .getPublicUrl(filePath);

    res.json({
      success: true,
      filename,
      path: filePath,
      url: publicUrlData.publicUrl,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ detail: 'Upload failed' });
  }
});

// Generate campaign
app.post('/api/campaigns/generate', authenticateToken, async (req, res) => {
  try {
    const { product_description, category, subcategory, campaign_type, tone, reference_image_url } = req.body;

    if (!product_description || !category || !subcategory || !campaign_type) {
      return res.status(400).json({ detail: 'Missing required fields' });
    }

    const basePrompt = `
IMPORTANT: Generate content SPECIFICALLY for this product/service:

Product Description: ${product_description}
Category: ${category}
Subcategory: ${subcategory}
Tone: ${tone || 'professional'}

Make sure all content is directly relevant and mentions specific details about THIS product.
`;

    let content = {};
    let posterDesign = null;

    // Generate poster design if reference image provided
    if (reference_image_url) {
      posterDesign = await generatePosterDesign(product_description, category, tone);
    }

    // Generate content based on campaign type
    if (campaign_type === 'social_media') {
      const prompt = basePrompt + `
Generate social media content that promotes THIS SPECIFIC product. Return JSON:
{
  "instagram_caption": "Engaging caption about THIS product with relevant emojis (max 150 chars)",
  "instagram_hashtags": ["10-15 hashtags relevant to THIS specific product"],
  "facebook_post": "Compelling post about THIS product's benefits (max 200 chars)",
  "facebook_hashtags": ["5-7 hashtags for THIS product"],
  "poster_title": "Eye-catching title for THIS product",
  "poster_description": "2-3 lines describing THIS product visually"
}
`;
      const response = await generateContentWithAI(prompt);
      try {
        content = JSON.parse(response.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch {
        content = { raw_response: response };
      }
    } else if (campaign_type === 'email') {
      const prompt = basePrompt + `
Generate email campaign for THIS SPECIFIC product. Return JSON:
{
  "subject_line": "Compelling subject about THIS product (50-60 chars)",
  "preview_text": "Preview mentioning THIS product's key benefit",
  "email_body": "Engaging email body about THIS product (200-300 words)",
  "cta_text": "Action button text for THIS product",
  "ps_line": "PS line with urgency for THIS product"
}
`;
      const response = await generateContentWithAI(prompt);
      try {
        content = JSON.parse(response.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch {
        content = { raw_response: response };
      }
    } else if (campaign_type === 'meta_ads') {
      const prompt = basePrompt + `
Generate Meta ad for THIS SPECIFIC product. Return JSON:
{
  "primary_text": "Ad copy about THIS product (125 chars)",
  "headline": "Attention-grabbing headline for THIS product (40 chars)",
  "description": "THIS product's key benefit (30 chars)",
  "cta": "Call-to-action for THIS product",
  "target_audience": "Specific audience interested in THIS product",
  "visual_text": "Text overlay mentioning THIS product"
}
`;
      const response = await generateContentWithAI(prompt);
      try {
        content = JSON.parse(response.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch {
        content = { raw_response: response };
      }
    }

    // Save campaign to Supabase
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: req.userId,
        campaign_type,
        category,
        subcategory,
        product_description,
        tone: tone || 'professional',
        content,
        poster_design: posterDesign,
        reference_image_url
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ detail: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Get all campaigns
app.get('/api/campaigns', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ detail: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Get single campaign
app.get('/api/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error) {
      return res.status(404).json({ detail: 'Campaign not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Delete campaign
app.delete('/api/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select();

    if (error || !data.length) {
      return res.status(404).json({ detail: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Get dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', req.userId);

    if (error) {
      return res.status(500).json({ detail: error.message });
    }

    const total = campaigns.length;
    const contentUsage = [
      { type: 'Social Media', count: campaigns.filter(c => c.campaign_type === 'social_media').length },
      { type: 'Email', count: campaigns.filter(c => c.campaign_type === 'email').length },
      { type: 'Meta Ads', count: campaigns.filter(c => c.campaign_type === 'meta_ads').length }
    ];

    const growthData = [
      { date: 'Mon', count: 5 },
      { date: 'Tue', count: 8 },
      { date: 'Wed', count: 12 },
      { date: 'Thu', count: 7 },
      { date: 'Fri', count: 15 },
      { date: 'Sat', count: 20 },
      { date: 'Sun', count: 18 }
    ];

    res.json({
      total_campaigns: total,
      total_assets: total,
      active_campaigns: total,
      downloads: total * 2,
      content_usage: contentUsage,
      growth_data: growthData
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ CampaignAI Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔗 Supabase: ${process.env.SUPABASE_URL}`);
});

module.exports = app;
