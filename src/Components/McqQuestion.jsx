import { useState } from 'react';

const McqQuestion = ({ question, onAnswerSelect, selectedOptions }) => {
  // Handle option selection
  const handleOptionSelect = (optionId) => {
    onAnswerSelect(question.question_id, optionId);
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{question.question_text}</h2>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          const isSelected = selectedOptions[question.question_id] === option.option_id;
          
          return (
            <div 
              key={option.option_id}
              onClick={() => handleOptionSelect(option.option_id)}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-blue-100 border-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                  isSelected
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200'
                }`}>
                  {String.fromCharCode(65 + question.options.indexOf(option))}
                </div>
                <span>{option.option_text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default McqQuestion;
                 