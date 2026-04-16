import { useState, useEffect } from 'react';
import { getAssessments, getAssessmentDetails } from '../utils/api';
import { Search, Eye, Calendar, User, FileText, Camera, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function AssessmentHistory() {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = assessments.filter(a => 
        a.child_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.child_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAssessments(filtered);
    } else {
      setFilteredAssessments(assessments);
    }
  }, [searchTerm, assessments]);

  const loadAssessments = async () => {
    try {
      const response = await getAssessments();
      setAssessments(response.data);
      setFilteredAssessments(response.data);
    } catch (error) {
      console.error('Failed to load assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (recordId) => {
    try {
      const response = await getAssessmentDetails(recordId);
      setSelectedAssessment(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to load details:', error);
    }
  };

  const exportPDF = (assessment) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('SMILE Assessment Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Child Name: ${assessment.child_name}`, 20, 40);
    doc.text(`Child ID: ${assessment.child_id}`, 20, 50);
    doc.text(`Age: ${assessment.age_months} months`, 20, 60);
    doc.text(`Gender: ${assessment.gender}`, 20, 70);
    doc.text(`Date: ${new Date(assessment.created_at).toLocaleDateString()}`, 20, 80);
    
    let yPos = 100;
    
    if (assessment.prediction) {
      doc.text(`Risk Level: ${assessment.prediction}`, 20, yPos);
      yPos += 10;
    }
    
    if (assessment.vision_emotion) {
      doc.text(`Emotion: ${assessment.vision_emotion}`, 20, yPos);
      yPos += 10;
      if (assessment.vision_overall_score) {
        doc.text(`Vision Score: ${assessment.vision_overall_score}/100`, 20, yPos);
        yPos += 10;
      }
    }
    
    doc.save(`${assessment.child_id}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
          Assessment History
        </h1>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Child ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Assessments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Child ID</th>
                  <th className="px-6 py-4 text-left">Child Name</th>
                  <th className="px-6 py-4 text-left">Age</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Risk Level</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No assessments found
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{assessment.child_id}</td>
                      <td className="px-6 py-4">{assessment.child_name}</td>
                      <td className="px-6 py-4">{assessment.age_months} months</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {assessment.has_assessment && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              Assessment
                            </span>
                          )}
                          {assessment.has_vision && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              Vision
                            </span>
                          )}
                          {!assessment.has_assessment && !assessment.has_vision && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              Basic Info
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {assessment.prediction ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            assessment.prediction === 'High' ? 'bg-red-100 text-red-800' :
                            assessment.prediction === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {assessment.prediction}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewDetails(assessment.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => exportPDF(assessment)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Export PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showModal && selectedAssessment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Assessment Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Child ID</p>
                    <p className="font-bold">{selectedAssessment.child_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Child Name</p>
                    <p className="font-bold">{selectedAssessment.child_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-bold">{selectedAssessment.age_months} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-bold">{selectedAssessment.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-bold">{new Date(selectedAssessment.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {selectedAssessment.prediction && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold mb-2">ML Risk Assessment</h3>
                    <p className="text-2xl font-bold text-blue-600">{selectedAssessment.prediction}</p>
                  </div>
                )}

                {selectedAssessment.vision_emotion && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-bold mb-2">Vision Analysis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Emotion</p>
                        <p className="font-bold capitalize">{selectedAssessment.vision_emotion}</p>
                      </div>
                      {selectedAssessment.vision_overall_score && (
                        <div>
                          <p className="text-sm text-gray-600">Overall Score</p>
                          <p className="font-bold">{selectedAssessment.vision_overall_score}/100</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-4">
                <button
                  onClick={() => exportPDF(selectedAssessment)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
