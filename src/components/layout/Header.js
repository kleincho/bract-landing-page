import React from 'react';

function Header() {
  return (
    <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-white">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">Good to see you, Lee.</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-sm hover:bg-sky-100">
          Temporary
        </button>
        <div className="w-8 h-8 bg-sky-100 rounded-full"></div>
      </div>
    </div>
  );
}

export default Header;
