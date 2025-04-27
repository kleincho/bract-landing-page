import React from 'react';
import MessageActions from './MessageActions';

function ChatMessage({ 
  message,  // This is mainResponse from backend
  isAI, 
  isLoading,
  confidence,  // Add these props
  references = [],  // Add with default empty array
  referencesCount = 0,  // Add with default 0
  targetPersona = null,  // Add this prop
  followupRecs = [],  // Add this new prop with default empty array
  onFollowupClick  // Add this prop
}) {
  // Add a helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const getSourceIcon = (type) => {
    switch (type) {
      case 'intern':
        return '🎓';
      case 'professional':
        return '💼';
      default:
        return '👤';
    }
  };

  console.log('ChatMessage props:', { message, isAI, confidence, targetPersona, followupRecs }); // Add debug log

  if (isLoading && isAI) {
    return (
      <div className="mb-6">
        <div className="flex justify-start">
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-4">
            🤖
          </div>
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-6 ${isAI ? '' : 'ml-auto'}`}>
      <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-4">
            🤖
          </div>
        )}
        
        <div className={`max-w-3xl rounded-lg ${
          isAI 
            ? 'bg-white border border-gray-200 shadow-sm' 
            : 'bg-sky-500 text-white'
        }`}>
          {isAI ? (
            <div className="divide-y divide-gray-100">
              {/* Metadata Bar */}
              <div className="px-4 py-2 bg-gray-50 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Confidence:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {confidence}
                    </span>
                  </div>
                  {targetPersona && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">🎯 Persona:</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {truncateText(targetPersona, 20)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Based on {referencesCount} sources
                </div>
              </div>

              {/* Main AI Response */}
              <div className="p-4">
                <p className="text-gray-800 mb-2">
                  {message}
                </p>

                {/* Add Followup Recommendations */}
                {followupRecs && followupRecs.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <span className="mr-2">💡</span>
                      Follow-up Questions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {followupRecs.map((rec, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (typeof onFollowupClick === 'function') {
                              onFollowupClick(rec);
                            }
                          }}
                          className="text-sm px-3 py-1.5 rounded-full bg-gray-100 
                                   text-gray-700 hover:bg-sky-100 hover:text-sky-700 
                                   transition-colors duration-200 flex items-center"
                        >
                          <span className="mr-1">↗️</span>
                          {rec}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* References Section */}
              {references.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-b-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                    <span className="mr-2">📚</span>
                    Expert Insights
                  </h3>
                  <div className="space-y-3">
                    {references.map((ref, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-lg border border-gray-200 p-3 hover:border-sky-200 transition-colors duration-200"
                      >
                        <blockquote className="text-gray-700 mb-3 italic">
                          "{ref.quote}"
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl" title={ref.type}>
                              {getSourceIcon(ref.type)}
                            </span>
                            <div>
                              <div className="text-sky-600 font-medium">
                                {ref.source}
                              </div>
                              <div className="text-xs text-gray-500">
                                {ref.role} · {ref.company}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-600" title="Copy quote">
                              📋
                            </button>
                            <button className="text-gray-400 hover:text-gray-600" title="More info">
                              ℹ️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <p className="text-white">{message}</p>
            </div>
          )}
        </div>
      </div>

      {isAI && (
        <div className="ml-12 mt-2">
          <MessageActions />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
