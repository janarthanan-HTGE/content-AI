import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const Settings = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved! (Note: This is a demo - actual update not implemented)');
  };

  return (
    <div className="p-12" data-testid="settings-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Outfit' }}>Settings</h1>
        <p className="text-lg text-[#52525B] mb-12" style={{ fontFamily: 'Manrope' }}>Manage your account</p>

        {/* Profile Section */}
        <div className="bg-white rounded-xl border-2 border-black p-8 mb-6 brutalist-card">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Outfit' }}>Profile Information</h2>

          <form onSubmit={handleSave} className="space-y-6">
            <div data-testid="profile-form">
              <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>
                Full Name
              </label>
              <div className="relative">
                <User strokeWidth={2.5} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#52525B]" />
                <input
                  data-testid="name-input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-[#FF5722]/30"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>
                Email
              </label>
              <div className="relative">
                <Mail strokeWidth={2.5} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#52525B]" />
                <input
                  data-testid="email-input"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-[#FF5722]/30"
                  placeholder="your@email.com"
                  disabled
                />
              </div>
              <p className="text-xs text-[#52525B] mt-1" style={{ fontFamily: 'Manrope' }}>Email cannot be changed</p>
            </div>

            <button
              data-testid="save-settings-btn"
              type="submit"
              className="w-full bg-[#FF5722] text-white font-bold py-3 rounded-md border-2 border-black brutalist-btn flex items-center justify-center gap-2"
              style={{ boxShadow: '4px 4px 0px 0px #0A0A0A', fontFamily: 'Outfit' }}
            >
              <Save strokeWidth={2.5} className="w-5 h-5" />
              Save Changes
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl border-2 border-black p-8 brutalist-card">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-[#52525B] mb-1" style={{ fontFamily: 'Manrope' }}>Member Since</p>
              <p className="font-bold" style={{ fontFamily: 'Outfit' }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#52525B] mb-1" style={{ fontFamily: 'Manrope' }}>User ID</p>
              <p className="font-mono text-sm break-all" style={{ fontFamily: 'Manrope' }}>{user?.id}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
