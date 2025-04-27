import React from 'react';

function MessageActions() {
  return (
    <div className="flex items-center space-x-2 mt-2">
      <button className="p-1 hover:bg-gray-100 rounded">
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
  );
}

export default MessageActions;
