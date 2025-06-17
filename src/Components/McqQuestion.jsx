import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const McqQuestion = ({ question, onAnswerSelect, selectedOptions }) => {
  // Handle option selection
  const handleOptionSelect = (optionId) => {
    onAnswerSelect(question.question_id, optionId);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const isMultiSelect = question.question_text.toLowerCase().includes('choose all that apply') || 
                        question.question_text.toLowerCase().includes('choose up to');

  // For rendering option letter (A, B, C...)
  const getOptionLetter = (index) => String.fromCharCode(65 + index);
  
  // Fix: Properly check if an option is selected for both single and multi-select questions
  const isOptionSelected = (optionId) => {
    const selection = selectedOptions[question.question_id];
    
    if (!selection) return false;
    
    if (Array.isArray(selection)) {
      // For multi-select questions
      return selection.includes(optionId);
    }
    
    // For single-select questions
    return selection === optionId;
  };
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 mb-6 border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-xl font-medium text-gray-800 mb-4">
        {question.question_id}. {question.question_text}
      </h2>
      
      <motion.div className="space-y-3" variants={containerVariants}>
        {question.options.map((option, index) => {
          const isSelected = isOptionSelected(option.option_id);
          
          return (
            <motion.div 
              key={option.option_id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleOptionSelect(option.option_id)}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all
                ${isSelected 
                  ? 'bg-blue-50 border border-blue-300 shadow-sm' 
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4
                ${isSelected 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'}`}
              >
                {getOptionLetter(index)}
              </div>
              <span className={`text-lg ${isSelected ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>
                {option.option_text}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {isMultiSelect && (
        <p className="text-sm text-blue-600 italic mt-3">
          * You can select multiple options for this question
        </p>
      )}
    </motion.div>
  );
};

export default McqQuestion;
