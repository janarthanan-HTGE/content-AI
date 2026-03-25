import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Download, RefreshCw, Upload, Image as ImageIcon, FileText, FileJson, Table } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { exportToPDF, exportToJSON, exportToCSV } from '../utils/exportUtils';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = [
  { value: 'electronics', label: 'Electronics', subcategories: ['Mobile', 'Laptop', 'Camera', 'Accessories'] },
  { value: 'apparel', label: 'Apparel', subcategories: ['T-shirt', 'Jeans', 'Dress', 'Shoes'] },
  { value: 'beauty', label: 'Beauty', subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'] },
  { value: 'food', label: 'Food & Beverage', subcategories: ['Restaurant', 'Cafe', 'Packaged Food', 'Drinks'] },
  { value: 'services', label: 'Services', subcategories: ['Consulting', 'Training', 'Maintenance', 'Design'] },
  { value: 'real_estate', label: 'Real Estate', subcategories: ['Residential', 'Commercial', 'Rental', 'Land'] },
];

const CAMPAIGN_TYPES = [
  { value: 'social_media', label: 'Social Media Post', desc: 'Instagram & Facebook content' },
  { value: 'email', label: 'Email Campaign', desc: 'Professional email marketing' },
  { value: 'meta_ads', label: 'Meta Ads', desc: 'Facebook & Instagram ads' },
];

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'sales_focused', label: 'Sales-Focused' },
];

export const Generator = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    product_description: '',
    category: '',
    subcategory: '',
    campaign_type: 'social_media',
    tone: 'professional',
    reference_image_url: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const selectedCategory = CATEGORIES.find(c => c.value === formData.category);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await axios.post(
        `${API}/storage/upload`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setFormData({ ...formData, reference_image_url: response.data.url });
      toast.success('Reference image uploaded!');
    } catch (error) {
      toast.error('Failed to upload image');
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!formData.product_description || !formData.category || !formData.subcategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setOutput(null);

    try {
      const response = await axios.post(
        `${API}/campaigns/generate`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutput(response.data);
      toast.success('Campaign generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const renderOutput = () => {
    if (!output) return null;

    const { campaign_type, content, poster_design } = output;

    return (
      <div className="space-y-6">
        {/* Export Buttons */}
        <div className="bg-white rounded-xl border-2 border-black p-6 brutalist-card">
          <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Outfit' }}>Export Campaign</h3>
          <div className="flex flex-wrap gap-3">
            <button
              data-testid="export-pdf-btn"
              onClick={() => {
                exportToPDF(output);
                toast.success('Exported as PDF!');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5722] text-white font-semibold border-2 border-black rounded-md brutalist-btn"
              style={{ boxShadow: '3px 3px 0px 0px #0A0A0A', fontFamily: 'Manrope' }}
            >
              <FileText strokeWidth={2.5} className="w-4 h-4" />
              Export PDF
            </button>
            <button
              data-testid="export-json-btn"
              onClick={() => {
                exportToJSON(output);
                toast.success('Exported as JSON!');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FFCC00] text-black font-semibold border-2 border-black rounded-md brutalist-btn"
              style={{ boxShadow: '3px 3px 0px 0px #0A0A0A', fontFamily: 'Manrope' }}
            >
              <FileJson strokeWidth={2.5} className="w-4 h-4" />
              Export JSON
            </button>
            <button
              data-testid="export-csv-btn"
              onClick={() => {
                exportToCSV(output);
                toast.success('Exported as CSV!');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#10B981] text-white font-semibold border-2 border-black rounded-md brutalist-btn"
              style={{ boxShadow: '3px 3px 0px 0px #0A0A0A', fontFamily: 'Manrope' }}
            >
              <Table strokeWidth={2.5} className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Poster Design Section */}
        {poster_design && (
          <div className="bg-white rounded-xl border-2 border-black p-6 brutalist-card" data-testid="poster-design">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>Poster Design</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OutputCard title="Title" content={poster_design.title} />
              <OutputCard title="Subtitle" content={poster_design.subtitle} />
              <OutputCard title="Main Text" content={poster_design.main_text} large />
              <OutputCard title="CTA Text" content={poster_design.cta_text} />
              <OutputCard title="Color Scheme" content={poster_design.color_scheme} />
              <OutputCard title="Layout Suggestion" content={poster_design.layout_suggestion} />
            </div>
            {formData.reference_image_url && (
              <div className="mt-4 border-2 border-black rounded-md overflow-hidden">
                <img 
                  src={formData.reference_image_url} 
                  alt="Reference" 
                  className="w-full max-h-64 object-contain bg-[#F3F4F6]"
                />
              </div>
            )}
          </div>
        )}

        {/* Campaign Content */}
        {campaign_type === 'social_media' && (
          <div className="space-y-4" data-testid="social-media-output">
            <OutputCard title="Instagram Caption" content={content.instagram_caption} />
            <OutputCard 
              title="Instagram Hashtags" 
              content={Array.isArray(content.instagram_hashtags) ? content.instagram_hashtags.join(' ') : content.instagram_hashtags} 
            />
            <OutputCard title="Facebook Post" content={content.facebook_post} />
            <OutputCard 
              title="Facebook Hashtags" 
              content={Array.isArray(content.facebook_hashtags) ? content.facebook_hashtags.join(' ') : content.facebook_hashtags} 
            />
            <OutputCard title="Poster Title" content={content.poster_title} />
            <OutputCard title="Poster Description" content={content.poster_description} />
          </div>
        )}

        {campaign_type === 'email' && (
          <div className="space-y-4" data-testid="email-output">
            <OutputCard title="Subject Line" content={content.subject_line} />
            <OutputCard title="Preview Text" content={content.preview_text} />
            <OutputCard title="Email Body" content={content.email_body} large />
            <OutputCard title="Call-to-Action" content={content.cta_text} />
            <OutputCard title="P.S. Line" content={content.ps_line} />
          </div>
        )}

        {campaign_type === 'meta_ads' && (
          <div className="space-y-4" data-testid="meta-ads-output">
            <OutputCard title="Primary Text" content={content.primary_text} />
            <OutputCard title="Headline" content={content.headline} />
            <OutputCard title="Description" content={content.description} />
            <OutputCard title="Call-to-Action" content={content.cta} />
            <OutputCard title="Target Audience" content={content.target_audience} />
            <OutputCard title="Visual Text Overlay" content={content.visual_text} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-12" data-testid="generator-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Outfit' }}>Generate Content</h1>
        <p className="text-lg text-[#52525B] mb-12" style={{ fontFamily: 'Manrope' }}>Create amazing campaigns in seconds</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border-2 border-black p-8 brutalist-card sticky top-8">
              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Reference Image Upload */}
                <div data-testid="image-upload-section">
                  <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>
                    Reference Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-black rounded-md p-4 text-center">
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      data-testid="file-input"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      {selectedFile ? (
                        <>
                          <ImageIcon strokeWidth={2.5} className="w-12 h-12 text-[#FF5722] mb-2" />
                          <p className="text-sm font-semibold" style={{ fontFamily: 'Manrope' }}>
                            {selectedFile.name}
                          </p>
                          {uploading && <p className="text-xs text-[#52525B] mt-1">Uploading...</p>}
                        </>
                      ) : (
                        <>
                          <Upload strokeWidth={2.5} className="w-12 h-12 text-[#52525B] mb-2" />
                          <p className="text-sm font-semibold" style={{ fontFamily: 'Manrope' }}>
                            Click to upload image
                          </p>
                          <p className="text-xs text-[#52525B] mt-1">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>
                    Product Description *
                  </label>
                  <textarea
                    data-testid="product-description-input"
                    value={formData.product_description}
                    onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-[#FF5722]/30 min-h-[120px]"
                    placeholder="Describe your product or service..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>
                    Category *
                  </label>
                  <select
                    data-testid="category-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                    className="w-full px-4 py-3 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-[#FF5722]/30 bg-white"
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {selectedCategory && (
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>
                      Subcategory *
                    </label>
                    <select
                      data-testid="subcategory-select"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-[#FF5722]/30 bg-white"
                      required
                    >
                      <option value="">Select subcategory</option>
                      {selectedCategory.subcategories.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>
                    Campaign Type
                  </label>
                  <div className="space-y-2">
                    {CAMPAIGN_TYPES.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-start gap-3 p-4 border-2 border-black rounded-md cursor-pointer transition-all ${
                          formData.campaign_type === type.value ? 'bg-[#FF5722] text-white' : 'bg-white hover:bg-[#F3F4F6]'
                        }`}
                        style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}
                      >
                        <input
                          data-testid={`campaign-type-${type.value}`}
                          type="radio"
                          name="campaign_type"
                          value={type.value}
                          checked={formData.campaign_type === type.value}
                          onChange={(e) => setFormData({ ...formData, campaign_type: e.target.value })}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-semibold" style={{ fontFamily: 'Manrope' }}>{type.label}</div>
                          <div className={`text-sm ${formData.campaign_type === type.value ? 'text-white/80' : 'text-[#52525B]'}`} style={{ fontFamily: 'Manrope' }}>
                            {type.desc}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>
                    Tone
                  </label>
                  <div className="flex gap-2">
                    {TONES.map((tone) => (
                      <button
                        key={tone.value}
                        data-testid={`tone-${tone.value}`}
                        type="button"
                        onClick={() => setFormData({ ...formData, tone: tone.value })}
                        className={`flex-1 px-4 py-2 text-sm font-semibold border-2 border-black rounded-md transition-all ${
                          formData.tone === tone.value ? 'bg-[#FFCC00] text-black' : 'bg-white text-black hover:bg-[#F3F4F6]'
                        }`}
                        style={{ boxShadow: '2px 2px 0px 0px #0A0A0A', fontFamily: 'Manrope' }}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  data-testid="generate-campaign-btn"
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full bg-[#FF5722] text-white font-bold py-4 rounded-md border-2 border-black brutalist-btn flex items-center justify-center gap-2"
                  style={{ boxShadow: '4px 4px 0px 0px #0A0A0A', fontFamily: 'Outfit', fontSize: '18px' }}
                >
                  {loading ? (
                    <>
                      <RefreshCw strokeWidth={2.5} className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles strokeWidth={2.5} className="w-5 h-5" />
                      Generate My Content
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="lg:col-span-7">
            {loading && (
              <div className="bg-white rounded-xl border-2 border-black p-12 text-center brutalist-card" data-testid="loading-state">
                <div className="inline-block animate-pulse">
                  <Sparkles strokeWidth={2.5} className="w-16 h-16 text-[#FF5722] mb-4" />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit' }}>Creating Magic...</h3>
                <p className="text-[#52525B]" style={{ fontFamily: 'Manrope' }}>Your campaign is being generated</p>
              </div>
            )}

            {!loading && !output && (
              <div className="bg-white rounded-xl border-2 border-black p-12 text-center brutalist-card" data-testid="empty-state">
                <Sparkles strokeWidth={2.5} className="w-16 h-16 text-[#52525B] mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit' }}>Ready to Create?</h3>
                <p className="text-[#52525B]" style={{ fontFamily: 'Manrope' }}>Fill in the form and click generate to create your campaign</p>
              </div>
            )}

            {!loading && output && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {renderOutput()}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const OutputCard = ({ title, content, large = false }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-xl border-2 border-black p-6 brutalist-card" data-testid={`output-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>{title}</h4>
        <button
          data-testid={`copy-${title.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={copyToClipboard}
          className="p-2 border-2 border-black rounded-md hover:bg-[#F3F4F6] transition-colors"
          style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}
        >
          <Copy strokeWidth={2.5} className="w-4 h-4" />
        </button>
      </div>
      <p className={`${large ? 'text-base' : 'text-sm'} whitespace-pre-wrap`} style={{ fontFamily: 'Manrope' }}>
        {content}
      </p>
    </div>
  );
};

export default Generator;
