import { useState } from 'react';
import { analyzeImage } from '../utils/api';
import { Camera, Upload, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function VisionAnalysis() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else {
      setError('Please drop an image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', image);
    
    try {
      const response = await analyzeImage(formData);
      console.log('Vision analysis response:', response.data);
      setResult(response.data);
    } catch (err) {
      console.error('Vision analysis error:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Analysis failed. Please try again.';
      setError(errorMsg);
      
      // Show more helpful error messages
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err.response?.status === 400) {
        setError('Invalid image file. Please upload a valid image (PNG, JPG, JPEG).');
      } else if (err.response?.status === 500) {
        setError('Server error during analysis. Please try a different image or contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getEmotionIcon = (emotion) => {
    const icons = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      neutral: '😐',
      surprise: '😮'
    };
    return icons[emotion] || '😐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <Camera className="w-10 h-10 text-blue-600" />
            Vision Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Upload a child's photo for comprehensive developmental assessment using computer vision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <Upload className="w-5 h-5 text-blue-600" />
              Upload Child Photo
            </h3>
            
            <div 
              className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {preview ? (
                <div className="space-y-4">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-80 mx-auto rounded-xl shadow-lg border-2 border-blue-200"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                      setResult(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="text-gray-500">
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="mb-2 font-semibold text-gray-700">Drag & Drop or Click to Upload</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                  <p className="text-xs mt-3 text-gray-400 bg-gray-50 inline-block px-4 py-2 rounded-full">
                    💡 Best results: Clear, well-lit photo showing child's face
                  </p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              {!preview && (
                <label
                  htmlFor="image-upload"
                  className="mt-4 inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Choose Image
                </label>
              )}
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Analyze Image
                </>
              )}
            </button>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Privacy Note:</strong> Images are analyzed locally and not stored permanently.
              </p>
            </div>
          </div>
          
          {/* Results Section */}
          {result && (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-100">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Analysis Results
              </h3>
              
              {/* Overall Score */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700">Overall Development Score</span>
                  <span className={`text-3xl font-bold ${
                    result.overall_score >= 80 ? 'text-green-600' :
                    result.overall_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {result.overall_score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      result.overall_score >= 80 ? 'bg-green-600' :
                      result.overall_score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{width: `${result.overall_score}%`}}
                  ></div>
                </div>
              </div>
              
              {/* Emotion Analysis */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h4 className="font-semibold mb-3 text-purple-900">Emotion Detection</h4>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-5xl">{getEmotionIcon(result.emotion.emotion)}</span>
                  <div className="flex-1">
                    <p className="text-lg font-bold capitalize">{result.emotion.emotion}</p>
                    <p className="text-sm text-gray-600">
                      Confidence: {(result.emotion.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                {result.emotion.all_emotions && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600 mb-2">All Emotions:</p>
                    {Object.entries(result.emotion.all_emotions).map(([emotion, score]) => (
                      <div key={emotion} className="flex items-center gap-2">
                        <span className="text-xs capitalize w-20">{emotion}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{width: `${score * 100}%`}}
                          ></div>
                        </div>
                        <span className="text-xs w-12 text-right">{(score * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Pose Analysis */}
              {result.pose.pose_detected && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="font-semibold mb-3 text-green-900">Pose & Motor Development</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">Posture Score</p>
                      <p className="text-2xl font-bold text-green-600">{result.pose.posture_score}/100</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">Balance Score</p>
                      <p className="text-2xl font-bold text-green-600">{result.pose.balance_score}/100</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">Symmetry</p>
                      <p className="text-2xl font-bold text-green-600">{(result.pose.symmetry_score * 100).toFixed(0)}%</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">Activity Level</p>
                      <p className="text-lg font-bold text-green-600 capitalize">{result.pose.activity_level}</p>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-white rounded">
                    <p className="text-xs text-gray-600">Motor Development</p>
                    <p className="font-medium capitalize">{result.pose.motor_development}</p>
                  </div>
                </div>
              )}

              {/* Facial Features */}
              {result.facial_features.face_detected && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-semibold mb-3 text-blue-900">Facial Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Eye Contact Quality</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        result.facial_features.eye_contact_quality === 'good' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.facial_features.eye_contact_quality}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Facial Symmetry</span>
                      <span className="font-bold">{(result.facial_features.facial_symmetry * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Eyes Detected</span>
                      <span className="font-bold">{result.facial_features.eyes_detected}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <h4 className="font-semibold mb-3 text-yellow-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Recommendations
                  </h4>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border-l-4 border-yellow-400">
                        <div className="flex items-start gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs rounded font-medium ${
                            rec.priority === 'High' ? 'bg-red-100 text-red-800' : 
                            rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {rec.priority}
                          </span>
                          <span className="font-medium text-sm flex-1">{rec.category}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-1">{rec.action}</p>
                        <p className="text-xs text-gray-600">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions when no result */}
          {!result && !loading && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800">How It Works</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Upload Photo</h4>
                    <p className="text-sm text-gray-600">Choose a clear, well-lit photo of the child</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">AI Analysis</h4>
                    <p className="text-sm text-gray-600">Our system analyzes emotion, pose, and facial features</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Get Results</h4>
                    <p className="text-sm text-gray-600">Receive comprehensive assessment and recommendations</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">What We Analyze:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Emotional state (happy, sad, neutral, etc.)</li>
                  <li>• Body posture and balance</li>
                  <li>• Motor development indicators</li>
                  <li>• Facial symmetry</li>
                  <li>• Eye contact quality</li>
                  <li>• Activity level estimation</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
