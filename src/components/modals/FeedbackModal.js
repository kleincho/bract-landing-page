import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

function FeedbackModal({ isOpen, onClose, messageData }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const feedbackOptions = [
    {
      id: 'like',
      text: 'Great response! This was helpful and informative.'
    },
    {
      id: 'better_quality',
      text: 'The expert insights could be more detailed or relevant.'
    },
    {
      id: 'no_quotes',
      text: 'I don\'t see any expert quotes. Please add some.'
    }
  ];

  const handleSubmit = async () => {
    try {
      const responseData = {
        mainResponse: messageData.text,
        references: messageData.references,
        confidence: messageData.confidence,
        referencesCount: messageData.referencesCount,
        targetPersona: messageData.targetPersona,
        followupRecs: messageData.followupRecs
      };

      const { data, error } = await supabase
        .from('response_feedbacks')
        .insert({
          created_at: new Date().toISOString(),
          response: responseData,
          feedback: selectedOption
        });

      if (error) throw error;

      // Show success state
      setIsSubmitted(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {isSubmitted ? (
          // Thank you message
          <div className="py-8 text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">
              Thank you for helping make HUMINT better!
            </h3>
            <p className="text-gray-600">Your feedback is valuable to us.</p>
          </div>
        ) : (
          // Original feedback form
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Provide Feedback!</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4">
              
              <p className="text-gray-600 mb-4">What do you think about this response?</p>
              
              <div className="space-y-3">
                {feedbackOptions.map((option) => (
                  <label 
                    key={option.id}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="feedback"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className="w-4 h-4 text-sky-600"
                    />
                    <span className="ml-3 text-gray-700">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`px-4 py-2 rounded-lg ${
                  selectedOption 
                    ? 'bg-sky-500 text-white hover:bg-sky-600' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Feedback
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FeedbackModal;
