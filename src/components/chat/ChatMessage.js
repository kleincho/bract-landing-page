import React from 'react';
import MessageActions from './MessageActions';
import wsoLogo from './wsoLogo.png';  // Add this import

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
    <div className={`mb-8 ${isAI ? '' : 'ml-auto'} max-w-3xl transform transition-all duration-300`}>
      <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
        {isAI && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 flex items-center justify-center mr-4 shadow-md">
            <span className="text-white text-lg">🤖</span>
          </div>
        )}
        
        <div className={`rounded-xl shadow-lg ${
          isAI 
            ? 'bg-white border border-gray-200' 
            : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white'
        }`}>
          {isAI ? (
            <div className="divide-y divide-gray-100">
              {/* Improved metadata bar */}
              <div className="px-6 py-3 bg-gray-50 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Confidence</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {confidence}
                    </span>
                  </div>
                  {targetPersona && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Target</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {truncateText(targetPersona, 20)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Improved message content */}
              <div className="p-6">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {message}
                </p>

                {/* Improved follow-up suggestions */}
                {followupRecs?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      Suggested Follow-ups
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {followupRecs.map((rec, index) => (
                        <button
                          key={index}
                          onClick={() => onFollowupClick?.(rec)}
                          className="px-4 py-2 rounded-lg bg-gray-50 text-gray-700 
                                   hover:bg-sky-50 hover:text-sky-700 
                                   transition-all duration-300 transform hover:scale-105"
                        >
                          {rec}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Improved references section */}
              {references.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-b-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    Expert Insights ({references.length})
                  </h3>
                  <div className="space-y-4">
                    {references.map((ref, index) => (
                      <div 
                        key={index}
                        className="bg-white rounded-xl border border-gray-200 p-4
                                 hover:border-sky-200 hover:shadow-md 
                                 transition-all duration-300"
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
                              <div className="text-xs text-gray-500 flex items-center">
                                <span>
                                  {ref.role} · {ref.university || ref.company}
                                </span>
                                {ref.linkedinProfile && (
                                  <a 
                                    href={ref.linkedinProfile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                    title="View LinkedIn Profile"
                                  >
                                    <svg 
                                      className="w-4 h-4 inline-block" 
                                      fill="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                  </a>
                                )}
                                {ref.wsoLink && (
                                  <a 
                                    href={ref.wsoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2"
                                    title="View WSO Thread"
                                  >
                                    <img 
                                      src={wsoLogo}
                                      alt="WSO"
                                      className="w-4 h-4 inline-block"
                                    />
                                  </a>
                                )}
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
              <p className="text-white text-lg">{message}</p>
            </div>
          )}
        </div>
      </div>

      {isAI && (
        <div className="ml-12 mt-2">
          <MessageActions 
            messageData={{
              text: message,
              references,
              targetPersona
            }} 
          />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
