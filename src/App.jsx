import React, { useState } from 'react';
import SectionContainer from './components/SectionContainer';
import questionData from './data.js';

function App() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleAnswerSelect = (questionId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNextSection = () => {
    if (currentSectionIndex < questionData.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFinalSubmit = () => {
    // Prepare answers object with question_id -> option_id mapping
    const finalAnswers = Object.entries(selectedOptions).map(([questionId, optionId]) => ({
      question_id: parseInt(questionId),
      selected_option_id: optionId
    }));
    
    console.log("Submitting answers:", finalAnswers);
    
    // Here you would typically send the data to an API
    setIsSubmitted(true);
  };

  // Check if current section has answered all questions
  const currentSection = questionData[currentSectionIndex];
  const currentSectionQuestionIds = currentSection.questions.map(q => q.question_id);
  const hasAnsweredAllQuestions = currentSectionQuestionIds.every(qId => selectedOptions[qId] !== undefined);

  // Calculate progress percentage
  const progress = Math.round(((currentSectionIndex) / (questionData.length)) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {isSubmitted ? (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
          <p className="mb-4">Your answers have been submitted successfully.</p>
          <pre className="bg-gray-100 p-4 rounded text-sm text-left overflow-auto">
            {JSON.stringify(selectedOptions, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="mb-6 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Step indicator */}
          <p className="text-center mb-8 text-gray-600 font-medium">
            Section {currentSectionIndex + 1} of {questionData.length}: {currentSection.section_name}
          </p>
          
          <SectionContainer 
            section={currentSection}
            onAnswerSelect={handleAnswerSelect}
            selectedOptions={selectedOptions}
          />
          
          <div className="flex justify-between mt-8">
            <button 
              onClick={handlePreviousSection}
              disabled={currentSectionIndex === 0}
              className={`px-5 py-2 rounded-md ${
                currentSectionIndex > 0
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
            >
              Previous Section
            </button>
            
            {currentSectionIndex < questionData.length - 1 ? (
              <button 
                onClick={handleNextSection}
                disabled={!hasAnsweredAllQuestions}
                className={`px-5 py-2 rounded-md ${
                  hasAnsweredAllQuestions
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                Next Section
              </button>
            ) : (
              <button 
                onClick={handleFinalSubmit}
                disabled={!hasAnsweredAllQuestions}
                className={`px-5 py-2 rounded-md ${
                  hasAnsweredAllQuestions
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                Submit All Answers
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;