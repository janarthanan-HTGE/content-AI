import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Eye, Calendar, Copy, Download, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CAMPAIGN_TYPE_LABELS = {
  social_media: 'Social Media',
  email: 'Email',
  meta_ads: 'Meta Ads',
};

const CAMPAIGN_COLORS = {
  social_media: '#FF5722',
  email: '#FFCC00',
  meta_ads: '#10B981',
};

export const Library = () => {
  const { token } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = campaigns.filter(
        (c) =>
          c.product_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCampaigns(filtered);
    } else {
      setFilteredCampaigns(campaigns);
    }
  }, [searchQuery, campaigns]);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API}/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(response.data);
      setFilteredCampaigns(response.data);
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (id) => {
    try {
      await axios.delete(`${API}/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(campaigns.filter((c) => c.id !== id));
      setSelectedCampaign(null);
      toast.success('Campaign deleted');
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  const copyContent = (content) => {
    const contentText = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
    navigator.clipboard.writeText(contentText);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold" style={{ fontFamily: 'Outfit' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-12" data-testid="library-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Outfit' }}>Library</h1>
        <p className="text-lg text-[#52525B] mb-8" style={{ fontFamily: 'Manrope' }}>Your campaign history</p>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search strokeWidth={2.5} className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#52525B]" />
            <input
              data-testid="library-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full pl-12 pr-4 py-4 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-[#FF5722]/30 bg-white"
              style={{ fontFamily: 'Manrope', boxShadow: '4px 4px 0px 0px #0A0A0A' }}
            />
          </div>
        </div>

        {/* Campaign Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-black p-12 text-center brutalist-card" data-testid="empty-library">
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit' }}>No Campaigns Yet</h3>
            <p className="text-[#52525B]" style={{ fontFamily: 'Manrope' }}>
              {searchQuery ? 'No campaigns match your search' : 'Start creating your first campaign'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white rounded-xl border-2 border-black overflow-hidden brutalist-card cursor-pointer"
                onClick={() => setSelectedCampaign(campaign)}
                data-testid={`campaign-card-${index}`}
              >
                <div
                  className="h-3"
                  style={{ backgroundColor: CAMPAIGN_COLORS[campaign.campaign_type] }}
                />
                {campaign.reference_image_url && (
                  <div className="relative h-40 overflow-hidden bg-[#F3F4F6]">
                    <img 
                      src={campaign.reference_image_url} 
                      alt="Reference"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border border-black"
                      style={{
                        fontFamily: 'Manrope',
                        backgroundColor: CAMPAIGN_COLORS[campaign.campaign_type],
                        color: campaign.campaign_type === 'email' ? '#0A0A0A' : '#FFFFFF',
                      }}
                      data-testid={`campaign-type-badge-${index}`}
                    >
                      {CAMPAIGN_TYPE_LABELS[campaign.campaign_type]}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[#52525B]" style={{ fontFamily: 'Manrope' }}>
                      <Calendar strokeWidth={2.5} className="w-3 h-3" />
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ fontFamily: 'Outfit' }}>
                    {campaign.category} - {campaign.subcategory}
                  </h3>
                  <p className="text-sm text-[#52525B] mb-4 line-clamp-3" style={{ fontFamily: 'Manrope' }}>
                    {campaign.product_description}
                  </p>

                  <div className="flex gap-2">
                    <button
                      data-testid={`view-campaign-btn-${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCampaign(campaign);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FF5722] text-white font-semibold border-2 border-black rounded-md brutalist-btn text-sm"
                      style={{ boxShadow: '2px 2px 0px 0px #0A0A0A', fontFamily: 'Manrope' }}
                    >
                      <Eye strokeWidth={2.5} className="w-4 h-4" />
                      View
                    </button>
                    <button
                      data-testid={`delete-campaign-btn-${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCampaign(campaign.id);
                      }}
                      className="px-4 py-2 bg-white border-2 border-black rounded-md brutalist-btn"
                      style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}
                    >
                      <Trash2 strokeWidth={2.5} className="w-4 h-4 text-[#FF3B30]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Enhanced Campaign Detail Modal */}
      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onCopy={copyContent}
          onDelete={deleteCampaign}
        />
      )}
    </div>
  );
};

const CampaignDetailModal = ({ campaign, onClose, onCopy, onDelete }) => {
  const renderContent = () => {
    const { campaign_type, content, poster_design } = campaign;

    return (
      <div className="space-y-6">
        {/* Poster Design Section */}
        {poster_design && (
          <div className="bg-[#F3F4F6] rounded-md p-6 border border-black">
            <h4 className="text-xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>Poster Design</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ContentField label="Title" value={poster_design.title} onCopy={() => onCopy(poster_design.title)} />
              <ContentField label="Subtitle" value={poster_design.subtitle} onCopy={() => onCopy(poster_design.subtitle)} />
              <ContentField label="Main Text" value={poster_design.main_text} onCopy={() => onCopy(poster_design.main_text)} />
              <ContentField label="CTA" value={poster_design.cta_text} onCopy={() => onCopy(poster_design.cta_text)} />
              <ContentField label="Color Scheme" value={poster_design.color_scheme} onCopy={() => onCopy(poster_design.color_scheme)} />
              <ContentField label="Layout" value={poster_design.layout_suggestion} onCopy={() => onCopy(poster_design.layout_suggestion)} />
            </div>
          </div>
        )}

        {/* Reference Image */}
        {campaign.reference_image_url && (
          <div className="border-2 border-black rounded-md overflow-hidden">
            <img src={campaign.reference_image_url} alt="Reference" className="w-full max-h-80 object-contain bg-[#F3F4F6]" />
          </div>
        )}

        {/* Campaign Content */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold" style={{ fontFamily: 'Outfit' }}>Generated Content</h4>
          
          {campaign_type === 'social_media' && (
            <div className="grid grid-cols-1 gap-4">
              <ContentField label="Instagram Caption" value={content.instagram_caption} onCopy={() => onCopy(content.instagram_caption)} />
              <ContentField label="Instagram Hashtags" value={Array.isArray(content.instagram_hashtags) ? content.instagram_hashtags.join(' ') : content.instagram_hashtags} onCopy={() => onCopy(content.instagram_hashtags)} />
              <ContentField label="Facebook Post" value={content.facebook_post} onCopy={() => onCopy(content.facebook_post)} />
              <ContentField label="Facebook Hashtags" value={Array.isArray(content.facebook_hashtags) ? content.facebook_hashtags.join(' ') : content.facebook_hashtags} onCopy={() => onCopy(content.facebook_hashtags)} />
            </div>
          )}

          {campaign_type === 'email' && (
            <div className="grid grid-cols-1 gap-4">
              <ContentField label="Subject Line" value={content.subject_line} onCopy={() => onCopy(content.subject_line)} />
              <ContentField label="Preview Text" value={content.preview_text} onCopy={() => onCopy(content.preview_text)} />
              <ContentField label="Email Body" value={content.email_body} onCopy={() => onCopy(content.email_body)} large />
              <ContentField label="CTA Text" value={content.cta_text} onCopy={() => onCopy(content.cta_text)} />
              <ContentField label="P.S. Line" value={content.ps_line} onCopy={() => onCopy(content.ps_line)} />
            </div>
          )}

          {campaign_type === 'meta_ads' && (
            <div className="grid grid-cols-1 gap-4">
              <ContentField label="Primary Text" value={content.primary_text} onCopy={() => onCopy(content.primary_text)} />
              <ContentField label="Headline" value={content.headline} onCopy={() => onCopy(content.headline)} />
              <ContentField label="Description" value={content.description} onCopy={() => onCopy(content.description)} />
              <ContentField label="Call-to-Action" value={content.cta} onCopy={() => onCopy(content.cta)} />
              <ContentField label="Target Audience" value={content.target_audience} onCopy={() => onCopy(content.target_audience)} />
              <ContentField label="Visual Text" value={content.visual_text} onCopy={() => onCopy(content.visual_text)} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      data-testid="campaign-detail-modal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl border-2 border-black max-w-4xl w-full max-h-[85vh] overflow-auto p-8"
        style={{ boxShadow: '8px 8px 0px 0px #0A0A0A' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }}>Campaign Details</h2>
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(campaign.id)}
              className="px-4 py-2 bg-[#FF3B30] text-white border-2 border-black rounded-md brutalist-btn font-bold flex items-center gap-2"
              style={{ boxShadow: '2px 2px 0px 0px #0A0A0A', fontFamily: 'Manrope' }}
              data-testid="delete-campaign-modal-btn"
            >
              <Trash2 strokeWidth={2.5} className="w-4 h-4" />
              Delete
            </button>
            <button
              data-testid="close-modal-btn"
              onClick={onClose}
              className="px-4 py-2 bg-white border-2 border-black rounded-md brutalist-btn font-bold flex items-center gap-2"
              style={{ boxShadow: '2px 2px 0px 0px #0A0A0A', fontFamily: 'Manrope' }}
            >
              <X strokeWidth={2.5} className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <InfoField label="Type" value={CAMPAIGN_TYPE_LABELS[campaign.campaign_type]} />
            <InfoField label="Tone" value={campaign.tone.replace('_', ' ')} capitalize />
            <InfoField label="Category" value={campaign.category} capitalize />
            <InfoField label="Subcategory" value={campaign.subcategory} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#52525B] mb-1" style={{ fontFamily: 'Manrope' }}>Description</p>
            <p className="text-sm" style={{ fontFamily: 'Manrope' }}>{campaign.product_description}</p>
          </div>
        </div>

        <div className="border-t-2 border-black pt-6">
          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
};

const InfoField = ({ label, value, capitalize = false }) => (
  <div>
    <p className="text-xs font-semibold text-[#52525B] mb-1" style={{ fontFamily: 'Manrope' }}>{label}</p>
    <p className={`font-bold ${capitalize ? 'capitalize' : ''}`} style={{ fontFamily: 'Outfit' }}>{value}</p>
  </div>
);

const ContentField = ({ label, value, onCopy, large = false }) => (
  <div className="bg-white p-4 rounded-md border-2 border-black" style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}>
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Manrope' }}>{label}</p>
      <button
        onClick={onCopy}
        className="p-1 hover:bg-[#F3F4F6] rounded transition-colors"
        title="Copy to clipboard"
      >
        <Copy strokeWidth={2.5} className="w-3 h-3" />
      </button>
    </div>
    <p className={`${large ? 'text-sm' : 'text-xs'} whitespace-pre-wrap`} style={{ fontFamily: 'Manrope' }}>
      {value}
    </p>
  </div>
);

export default Library;
