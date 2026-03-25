import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Zap, Target, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COLORS = ['#FF5722', '#FFCC00', '#10B981'];

export const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold" style={{ fontFamily: 'Outfit' }}>Loading...</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Campaigns', value: stats?.total_campaigns || 0, icon: Target, color: '#FF5722' },
    { label: 'Total Assets', value: stats?.total_assets || 0, icon: Zap, color: '#FFCC00' },
    { label: 'Active Campaigns', value: stats?.active_campaigns || 0, icon: TrendingUp, color: '#10B981' },
    { label: 'Downloads', value: stats?.downloads || 0, icon: Download, color: '#3B82F6' },
  ];

  return (
    <div className="p-12" data-testid="dashboard-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Outfit' }}>Dashboard</h1>
        <p className="text-lg text-[#52525B] mb-12" style={{ fontFamily: 'Manrope' }}>Your marketing command center</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl border-2 border-black p-6 brutalist-card"
                data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-md border-2 border-black"
                    style={{ backgroundColor: stat.color, boxShadow: '2px 2px 0px 0px #0A0A0A' }}
                  >
                    <Icon strokeWidth={2.5} className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-bold mb-1" style={{ fontFamily: 'Outfit' }}>{stat.value}</p>
                <p className="text-sm text-[#52525B] font-semibold" style={{ fontFamily: 'Manrope' }}>{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Content Usage Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-xl border-2 border-black p-8 brutalist-card"
            data-testid="content-usage-chart"
          >
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Outfit' }}>Content Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.content_usage || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.type}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  stroke="#0A0A0A"
                  strokeWidth={2}
                >
                  {(stats?.content_usage || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white rounded-xl border-2 border-black p-8 brutalist-card"
            data-testid="growth-chart"
          >
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Outfit' }}>Weekly Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.growth_data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                <XAxis dataKey="date" stroke="#0A0A0A" style={{ fontFamily: 'Manrope', fontSize: 12 }} />
                <YAxis stroke="#0A0A0A" style={{ fontFamily: 'Manrope', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#FF5722" stroke="#0A0A0A" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white rounded-xl border-2 border-black p-8 brutalist-card"
          data-testid="recent-activity"
        >
          <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>Recent Activity</h3>
          <p className="text-[#52525B]" style={{ fontFamily: 'Manrope' }}>
            {stats?.total_campaigns > 0
              ? `You've created ${stats.total_campaigns} campaigns. Keep up the great work!`
              : 'No campaigns yet. Start creating your first campaign!'}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
