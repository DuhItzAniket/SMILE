import { useState } from 'react';
import { predict } from '../utils/api';

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    child_id: '',
    age_months: 24,
    gender: 'Male',
    district: '',
    mandal: '',
    awc_code: '',
    GM_delay: 0,
    FM_delay: 0,
    LC_delay: 0,
    COG_delay: 0,
    SE_delay: 0,
    num_delays: 0,
    autism_risk: 'Low',
    adhd_risk: 'Low',
    behavior_risk: 'Low',
    underweight: 0,
    stunting: 0,
    wasting: 0,
    anemia: 0,
    nutrition_score: 75,
    nutrition_risk: 'Low',
    parent_child_interaction_score: 70,
    parent_mental_health_score: 70,
    home_stimulation_score: 70,
    play_materials: 'Adequate',
    caregiver_engagement: 'High',
    language_exposure: 'High',
    safe_water: 'Yes',
    toilet_facility: 'Yes',
    mode_delivery: 'Normal',
    mode_conception: 'Natural',
    birth_status: 'Term',
    consanguinity: 'No',
    GM_DQ: 90,
    FM_DQ: 90,
    LC_DQ: 90,
    COG_DQ: 90,
    SE_DQ: 90
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await predict(formData);
      setResult(response.data);
    } catch (error) {
      alert('Prediction failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk === 'Low') return 'text-green-600 bg-green-50';
    if (risk === 'Medium') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Child Risk Assessment</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Child ID</label>
              <input
                type="text"
                name="child_id"
                value={formData.child_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age (months)</label>
              <input
                type="number"
                name="age_months"
                value={formData.age_months}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mandal</label>
              <input
                type="text"
                name="mandal"
                value={formData.mandal}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">AWC Code</label>
              <input
                type="text"
                name="awc_code"
                value={formData.awc_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Developmental Delays */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Developmental Delays</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['GM_delay', 'FM_delay', 'LC_delay', 'COG_delay', 'SE_delay'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.replace('_delay', '')}
                </label>
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Developmental Quotients */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Developmental Quotients (DQ)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['GM_DQ', 'FM_DQ', 'LC_DQ', 'COG_DQ', 'SE_DQ'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.replace('_DQ', '')}
                </label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  step="0.1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Nutrition Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['underweight', 'stunting', 'wasting', 'anemia'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1">Nutrition Score</label>
              <input
                type="number"
                name="nutrition_score"
                value={formData.nutrition_score}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400"
        >
          {loading ? 'Predicting...' : 'Predict Risk'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Prediction Result</h3>
          <div className={`text-2xl font-bold p-4 rounded-lg ${getRiskColor(result.prediction)}`}>
            Risk Level: {result.prediction}
          </div>
          <p className="text-sm text-gray-600 mt-2">Record ID: {result.record_id}</p>
        </div>
      )}
    </div>
  );
}
