import React, { useState } from 'react';
import FeedbackModal from '../modals/FeedbackModal';

function MessageActions({ messageData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center space-x-2 mt-2">
        <button 
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <span>📋</span>
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <span>👍</span>
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <span>👎</span>
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <span>↩️</span>
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <span>⚡</span>
        </button>
      </div>

      <FeedbackModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        messageData={messageData}
      />
    </>
  );
}

export default MessageActions;
