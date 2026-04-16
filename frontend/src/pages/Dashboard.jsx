import { useState, useEffect } from 'react';
import { getDashboardData, getStats } from '../utils/api';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, AlertTriangle, TrendingUp, Activity, Brain, Heart, Eye, Target, Award, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardRes, statsRes] = await Promise.all([
        getDashboardData(),
        getStats()
      ]);
      setData(dashboardRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Early Childhood Development Monitoring System
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Children</p>
                <p className="text-4xl font-bold mt-2">{stats?.total || 0}</p>
                <p className="text-blue-100 text-xs mt-1">Registered in system</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Users className="w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">High Risk</p>
                <p className="text-4xl font-bold mt-2">{stats?.high_risk || 0}</p>
                <p className="text-red-100 text-xs mt-1">{stats?.high_risk_percentage}% of total</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <AlertTriangle className="w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Medium Risk</p>
                <p className="text-4xl font-bold mt-2">{stats?.medium_risk || 0}</p>
                <p className="text-yellow-100 text-xs mt-1">{stats?.medium_risk_percentage}% of total</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <TrendingUp className="w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Low Risk</p>
                <p className="text-4xl font-bold mt-2">{stats?.low_risk || 0}</p>
                <p className="text-green-100 text-xs mt-1">{stats?.low_risk_percentage}% of total</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Activity className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Risk Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.riskDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(data?.riskDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(data?.riskDistribution || []).map((item, idx) => (
                <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{backgroundColor: item.color}}></div>
                  <p className="text-xs font-medium text-gray-700">{item.name}</p>
                  <p className="text-sm font-bold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Delays */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-800">Developmental Domain Delays</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.domainDelays || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{fontSize: 11}}
                />
                <YAxis 
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
                  tick={{fontSize: 12}}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'percentage') return [`${value}%`, 'Percentage'];
                    return [value, 'Count'];
                  }}
                  contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb'}}
                />
                <Bar dataKey="percentage" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Shows percentage of children with delays in each developmental domain
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-800">Monthly Screening Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.monthlyTrends || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb'}} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="screened" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{fill: '#3B82F6', r: 5}}
                activeDot={{r: 7}}
              />
              <Line 
                type="monotone" 
                dataKey="improved" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{fill: '#10B981', r: 5}}
                activeDot={{r: 7}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-8 h-8" />
              <h4 className="font-bold text-lg">Success Rate</h4>
            </div>
            <p className="text-3xl font-bold mb-2">85%</p>
            <p className="text-purple-100 text-sm">Children showing improvement after intervention</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-8 h-8" />
              <h4 className="font-bold text-lg">Early Detection</h4>
            </div>
            <p className="text-3xl font-bold mb-2">92%</p>
            <p className="text-indigo-100 text-sm">Cases identified before 36 months of age</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-8 h-8" />
              <h4 className="font-bold text-lg">Accuracy</h4>
            </div>
            <p className="text-3xl font-bold mb-2">99.5%</p>
            <p className="text-pink-100 text-sm">ML model prediction accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
