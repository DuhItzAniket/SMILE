import { useState } from 'react';
import { unifiedAssessment } from '../utils/api';
import { User, Camera, FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function UnifiedAssessment() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    child_id: '',
    child_name: '',
    age_months: '',
    gender: '',
    district: '',
    mandal: '',
    awc_code: '',
    GM_DQ: '', FM_DQ: '', LC_DQ: '', COG_DQ: '', SE_DQ: '',
    gross_motor_delay: '', fine_motor_delay: '', language_delay: '', cognitive_delay: '', social_emotional_delay: '',
    underweight: '', stunting: '', wasting: '', anemia: '',
    birth_complications: '', preterm_birth: '', low_birth_weight: '', neonatal_complications: '', chronic_illness: '', hospitalization_history: '',
    autism_risk: '', adhd_risk: '', behavioral_concerns: '', sensory_issues: '', sleep_disturbances: '', feeding_difficulties: '',
    parent_child_interaction: '', home_stimulation: '', caregiver_responsiveness: '', learning_materials_available: '', play_opportunities: '', family_support: '', maternal_education: '', maternal_mental_health: '', socioeconomic_status: '', access_to_healthcare: '',
    attention_span: '', social_interaction: '', emotional_regulation: '', adaptive_behavior: '', communication_attempts: ''
  });
  
  const [assessmentType, setAssessmentType] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('child_id', formData.child_id);
      formDataToSend.append('child_name', formData.child_name);
      formDataToSend.append('age_months', formData.age_months);
      formDataToSend.append('gender', formData.gender);
      if (formData.district) formDataToSend.append('district', formData.district);
      if (formData.mandal) formDataToSend.append('mandal', formData.mandal);
      if (formData.awc_code) formDataToSend.append('awc_code', formData.awc_code);
      
      if (assessmentType === 'full') {
        const assessmentData = {};
        Object.keys(formData).forEach(key => {
          if (!['child_id', 'child_name', 'age_months', 'gender', 'district', 'mandal', 'awc_code'].includes(key) && formData[key] !== '') {
            assessmentData[key] = parseFloat(formData[key]) || formData[key];
          }
        });
        if (Object.keys(assessmentData).length > 0) {
          formDataToSend.append('assessment_data', JSON.stringify(assessmentData));
        }
      }
      
      if (image) {
        formDataToSend.append('image', image);
      }

      console.log('Submitting assessment:', assessmentType);
      const response = await unifiedAssessment(formDataToSend);
      console.log('Response:', response.data);
      setResult(response.data);
      setStep(4);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.detail || err.message || 'Assessment failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      child_id: '', child_name: '', age_months: '', gender: '', district: '', mandal: '', awc_code: '',
      GM_DQ: '', FM_DQ: '', LC_DQ: '', COG_DQ: '', SE_DQ: '',
      gross_motor_delay: '', fine_motor_delay: '', language_delay: '', cognitive_delay: '', social_emotional_delay: '',
      underweight: '', stunting: '', wasting: '', anemia: '',
      birth_complications: '', preterm_birth: '', low_birth_weight: '', neonatal_complications: '', chronic_illness: '', hospitalization_history: '',
      autism_risk: '', adhd_risk: '', behavioral_concerns: '', sensory_issues: '', sleep_disturbances: '', feeding_difficulties: '',
      parent_child_interaction: '', home_stimulation: '', caregiver_responsiveness: '', learning_materials_available: '', play_opportunities: '', family_support: '', maternal_education: '', maternal_mental_health: '', socioeconomic_status: '', access_to_healthcare: '',
      attention_span: '', social_interaction: '', emotional_regulation: '', adaptive_behavior: '', communication_attempts: ''
    });
    setAssessmentType('');
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
          New Child Assessment
        </h1>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-16 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child ID <span className="text-red-500">*</span>
                </label>
                <input type="text" name="child_id" value={formData.child_id} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child Name <span className="text-red-500">*</span>
                </label>
                <input type="text" name="child_name" value={formData.child_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (months) <span className="text-red-500">*</span>
                </label>
                <input type="number" name="age_months" value={formData.age_months} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
                <input type="text" name="mandal" value={formData.mandal} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AWC Code</label>
                <input type="text" name="awc_code" value={formData.awc_code} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button onClick={() => setStep(2)} disabled={!formData.child_id || !formData.child_name || !formData.age_months || !formData.gender} className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold disabled:from-gray-400 disabled:to-gray-400 flex items-center justify-center gap-2">
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Choose Assessment Type */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Choose Assessment Type</h2>
            <p className="text-gray-600 mb-8">Select what you want to assess</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button onClick={() => { setAssessmentType('full'); setStep(3); }} className="p-8 border-2 border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Full Assessment</h3>
                <p className="text-sm text-gray-600">Complete developmental assessment with ML prediction</p>
              </button>

              <button onClick={() => { setAssessmentType('vision'); setStep(3); }} className="p-8 border-2 border-purple-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition">
                <Camera className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Vision Only</h3>
                <p className="text-sm text-gray-600">Photo analysis for emotion & pose</p>
              </button>

              <button onClick={() => { setAssessmentType('skip'); setStep(3); }} className="p-8 border-2 border-gray-300 rounded-xl hover:border-gray-500 hover:bg-gray-50 transition">
                <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Basic Only</h3>
                <p className="text-sm text-gray-600">Save basic info without assessment</p>
              </button>
            </div>

            <button onClick={() => setStep(1)} className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold">Back</button>
          </div>
        )}

        {/* Step 3: Full Assessment or Vision or Skip */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-h-[80vh] overflow-y-auto">
            {assessmentType === 'full' && (
              <>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Full Developmental Assessment
                </h2>
                <div className="mb-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                  <p className="text-sm text-blue-800"><strong>Note:</strong> All fields are optional. Fill in as many as you can for better ML prediction accuracy.</p>
                </div>

                <div className="mb-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Developmental Quotient (DQ) Scores</h3>
                  <p className="text-sm text-gray-600 mb-4">Enter DQ scores (0-150, typically 85-115 is normal range)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium mb-2">Gross Motor DQ</label><input type="number" name="GM_DQ" value={formData.GM_DQ} onChange={handleChange} placeholder="e.g., 95" min="0" max="150" className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium mb-2">Fine Motor DQ</label><input type="number" name="FM_DQ" value={formData.FM_DQ} onChange={handleChange} placeholder="e.g., 100" min="0" max="150" className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium mb-2">Language & Communication DQ</label><input type="number" name="LC_DQ" value={formData.LC_DQ} onChange={handleChange} placeholder="e.g., 90" min="0" max="150" className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium mb-2">Cognitive DQ</label><input type="number" name="COG_DQ" value={formData.COG_DQ} onChange={handleChange} placeholder="e.g., 105" min="0" max="150" className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium mb-2">Social-Emotional DQ</label><input type="number" name="SE_DQ" value={formData.SE_DQ} onChange={handleChange} placeholder="e.g., 98" min="0" max="150" className="w-full px-3 py-2 border rounded-lg" /></div>
                  </div>
                </div>

                <div className="mb-8 p-6 bg-red-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-red-800">Developmental Delays</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['gross_motor_delay', 'fine_motor_delay', 'language_delay', 'cognitive_delay', 'social_emotional_delay'].map(field => (
                      <div key={field}><label className="block text-sm font-medium mb-2 capitalize">{field.replace(/_/g, ' ')}</label>
                        <select name={field} value={formData[field]} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                          <option value="">Select</option><option value="0">No</option><option value="1">Yes</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8 p-6 bg-green-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-green-800">Nutrition Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {['underweight', 'stunting', 'wasting', 'anemia'].map(field => (
                      <div key={field}><label className="block text-sm font-medium mb-2 capitalize">{field}</label>
                        <select name={field} value={formData[field]} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                          <option value="">Select</option><option value="0">No</option><option value="1">Yes</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8 p-6 bg-orange-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-orange-800">Health Risk Factors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['birth_complications', 'preterm_birth', 'low_birth_weight', 'neonatal_complications', 'chronic_illness', 'hospitalization_history'].map(field => (
                      <div key={field}><label className="block text-sm font-medium mb-2 capitalize">{field.replace(/_/g, ' ')}</label>
                        <select name={field} value={formData[field]} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                          <option value="">Select</option><option value="0">No</option><option value="1">Yes</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8 p-6 bg-purple-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-purple-800">Neuro-Behavioral Indicators</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['autism_risk', 'adhd_risk', 'behavioral_concerns', 'sensory_issues', 'sleep_disturbances', 'feeding_difficulties'].map(field => (
                      <div key={field}><label className="block text-sm font-medium mb-2 capitalize">{field.replace(/_/g, ' ')}</label>
                        <select name={field} value={formData[field]} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                          <option value="">Select</option><option value="0">No</option><option value="1">Yes</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8 p-6 bg-yellow-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-yellow-800">Environment & Caregiving</h3>
                  <p className="text-sm text-gray-600 mb-4">Rate on scale 0-10 (0=Poor, 5=Average, 10=Excellent)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['parent_child_interaction', 'home_stimulation', 'caregiver_responsiveness', 'learning_materials_available', 'play_opportunities', 'family_support', 'maternal_education', 'maternal_mental_health', 'socioeconomic_status', 'access_to_healthcare'].map(field => (
                      <div key={field}><label className="block text-sm font-medium mb-2 capitalize">{field.replace(/_/g, ' ')}</label>
                        <input type="number" name={field} value={formData[field]} onChange={handleChange} placeholder="0-10" min="0" max="10" className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8 p-6 bg-pink-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-pink-800">Behavior Indicators</h3>
                  <p className="text-sm text-gray-600 mb-4">Rate on scale 0-10 (0=Very Poor, 5=Average, 10=Excellent)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['attention_span', 'social_interaction', 'emotional_regulation', 'adaptive_behavior', 'communication_attempts'].map(field => (
                      <div key={field}><label className="block text-sm font-medium mb-2 capitalize">{field.replace(/_/g, ' ')}</label>
                        <input type="number" name={field} value={formData[field]} onChange={handleChange} placeholder="0-10" min="0" max="10" className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8 p-6 bg-indigo-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-indigo-800">Optional: Add Child Photo</h3>
                  <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center">
                    {preview ? (
                      <div className="space-y-4">
                        <img src={preview} alt="Preview" className="max-h-60 mx-auto rounded-lg" />
                        <button onClick={() => { setImage(null); setPreview(null); }} className="text-sm text-red-600">Remove</button>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="full-image" />
                        <label htmlFor="full-image" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer">Choose Image</label>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {assessmentType === 'vision' && (
              <>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Camera className="w-6 h-6 text-purple-600" />
                  Upload Child Photo
                </h2>

                <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer mb-6" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                  {preview ? (
                    <div className="space-y-4">
                      <img src={preview} alt="Preview" className="max-h-80 mx-auto rounded-xl shadow-lg border-2 border-purple-200" />
                      <button onClick={() => { setImage(null); setPreview(null); }} className="text-sm text-red-600 hover:text-red-700">Remove Image</button>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-10 h-10 text-purple-600" />
                      </div>
                      <p className="mb-2 font-semibold text-gray-700">Drag & Drop or Click to Upload</p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  )}
                  
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                  {!preview && (
                    <label htmlFor="image-upload" className="mt-4 inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg cursor-pointer hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg font-medium">
                      Choose Image
                    </label>
                  )}
                </div>
              </>
            )}

            {assessmentType === 'skip' && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Ready to Submit</h2>
                <p className="text-gray-600 mb-8">Basic information will be saved</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold">Back</button>
              <button onClick={handleSubmit} disabled={loading || (assessmentType === 'vision' && !image)} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold disabled:from-gray-400 disabled:to-gray-400 hover:from-green-700 hover:to-green-800 transition">
                {loading ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && result && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800">Assessment Complete!</h2>
              <p className="text-gray-600 mt-2">Record ID: {result.record_id}</p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Child Information</h3>
                <p><strong>Name:</strong> {result.child_name}</p>
                <p><strong>ID:</strong> {result.child_id}</p>
              </div>

              {result.ml_prediction && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">ML Risk Prediction</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Risk Category</p>
                      <p className={`text-2xl font-bold ${result.ml_prediction.predicted_category === 'Low' ? 'text-green-600' : result.ml_prediction.predicted_category === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {result.ml_prediction.predicted_category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-2xl font-bold text-blue-600">{(result.ml_prediction.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              )}

              {result.vision_analysis && (
                <div className="p-6 bg-purple-50 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">Vision Analysis Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Emotion</p>
                      <p className="text-2xl font-bold text-purple-600 capitalize">{result.vision_analysis.emotion?.emotion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Overall Score</p>
                      <p className="text-2xl font-bold text-purple-600">{result.vision_analysis.overall_score}/100</p>
                    </div>
                  </div>
                </div>
              )}

              {!result.ml_prediction && !result.vision_analysis && (
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">Basic information saved successfully</p>
                </div>
              )}
            </div>

            <button onClick={resetForm} className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold">
              New Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
