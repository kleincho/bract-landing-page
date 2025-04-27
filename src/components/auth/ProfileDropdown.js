import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { signOut } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1"
      >
        <img 
          src={user.user_metadata.avatar_url} 
          alt="Profile" 
          className="w-8 h-8 rounded-full"
        />
        <span className="sr-only">Open user menu</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 text-sm text-gray-900 border-b">
            <div className="font-medium truncate">{user.email}</div>
          </div>
          
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
