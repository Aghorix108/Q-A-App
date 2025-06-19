import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { decryptData } from '../utils/decryptionHelper';

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState('all');
  const [sections, setSections] = useState([]);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        
        // Fetch questions from API
        let allQuestions = [];
        let allSections = [];
        
        try {
          const token = localStorage.getItem('adminToken');
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/admin/questions`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (response.data && response.data.data) {
            const decryptedData = decryptData(response.data.data, import.meta.env.VITE_SECRET_KEY);
            if (decryptedData) {
              // Extract all sections
              allSections = decryptedData.map(section => ({
                id: section.section_id,
                name: section.section_name
              }));
              
              // Flatten questions and add section info
              decryptedData.forEach(section => {
                const questionsWithSection = section.questions.map(question => ({
                  ...question,
                  section_id: section.section_id,
                  section_name: section.section_name
                }));
                allQuestions = [...allQuestions, ...questionsWithSection];
              });
            }
          }
        } catch (apiError) {
          console.error('API request failed:', apiError);
          
          // If API fails, get questions from imported questionData
          const importedData = await import('../data.js').then(module => module.default || []);
          
          allSections = importedData.map(section => ({
            id: section.section_id,
            name: section.section_name
          }));
          
          importedData.forEach(section => {
            const questionsWithSection = section.questions.map(question => ({
              ...question,
              section_id: section.section_id,
              section_name: section.section_name
            }));
            allQuestions = [...allQuestions, ...questionsWithSection];
          });
        }
        
        setQuestions(allQuestions);
        setSections(allSections);
      } catch (err) {
        console.error('Error processing questions:', err);
        setError('Failed to load questions data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  const filteredQuestions = selectedSection === 'all'
    ? questions
    : questions.filter(q => q.section_id.toString() === selectedSection);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assessment Questions</h1>
        
        <div className="flex items-center">
          <label className="mr-2 text-gray-700 text-sm">Filter by section:</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sections</option>
            {sections.map(section => (
              <option key={section.id} value={section.id.toString()}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestions.map(question => (
                <tr key={question.question_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{question.question_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{question.section_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{question.question_text}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {question.options.length} options
                      <button className="ml-2 text-blue-600 hover:text-blue-800 text-xs">View</button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredQuestions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No questions found for the selected section
          </div>
        )}
        
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {filteredQuestions.length} of {questions.length} questions
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default QuestionsPage;
