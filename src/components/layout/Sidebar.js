import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileModal from '../modals/ProfileModal';
import AuthModal from '../modals/AuthModal';
import { supabase } from '../../services/supabaseClient';
import { fetchUserThreads } from '../../services/chatService';

function Sidebar({ onReset, onThreadSelect, currentScreen = 'start' }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, signOut, user } = useAuth();
  const [threads, setThreads] = useState({
    today: [],
    yesterday: [],
    previousWeek: []
  });

  // Date helper functions
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  };

  const isPreviousWeek = (date) => {
    const now = new Date();
    const weekAgo = new Date(now.setDate(now.getDate() - 7));
    return date > weekAgo && !isToday(date) && !isYesterday(date);
  };

  // Fetch and group threads
  useEffect(() => {
    console.log('Auth state in Sidebar:', {
      isAuthenticated,
      user,
      email: user?.email,
      name: user?.user_metadata?.full_name
    });

    if (isAuthenticated) {
      loadThreads();
    }
  }, [isAuthenticated, user]);

  const loadThreads = async () => {
    try {
      const { data: threadData, error } = await supabase
        .from('user_threads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const grouped = groupThreadsByDate(threadData);
      setThreads(grouped);
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  };

  const groupThreadsByDate = (threads) => {
    return {
      today: threads.filter(thread => isToday(new Date(thread.created_at))),
      yesterday: threads.filter(thread => isYesterday(new Date(thread.created_at))),
      previousWeek: threads.filter(thread => isPreviousWeek(new Date(thread.created_at)))
    };
  };

  const handleLogoClick = () => {
    if (onReset) {
      onReset();
    }
  };

  const handleNewThread = () => {
    onThreadSelect(null);
  };

  const handleThreadClick = (threadId) => {
    if (onThreadSelect) {
      console.log('Handling thread click:', threadId);
      onThreadSelect(threadId);
    }
  };

  const authenticatedMenuItems = [
    { 
      icon: "👤", 
      label: "Update My Info", 
      count: null,
      onClick: () => setIsProfileModalOpen(true)
    },
    {
      icon: "🚪", 
      label: "Sign Out",
      count: null,
      onClick: async () => {
        try {
          await signOut();
          // Optional: You can add a success message or handle the sign out completion
        } catch (error) {
          console.error('Error signing out:', error);
        }
      }
    }
  ];

  const projectGroups = [
    {
      title: "Today",
      items: ["Tailwind vs Alternatives"]
    },
    {
      title: "Yesterday",
      items: [
        "Citation Formatting Help",
        "Service Name Suggestions",
        "감사팀 수사 역량"
      ]
    },
    {
      title: "Previous 7 Days",
      items: [
        "Follow-up Email Improvement",
        "HTS Classification AI Potential",
        "Legal Document Generative Model"
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-gray-200 h-screen flex flex-col bg-white">
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={handleLogoClick}
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-sky-100 rounded"></div>
          <span className="font-semibold">HUMINT</span>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-2">
        {!isAuthenticated ? (
          <div 
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-sky-50 cursor-pointer"
            onClick={() => setIsAuthModalOpen(true)}
          >
            <span>🔑</span>
            <span className="flex-1">Sign in</span>
          </div>
        ) : (
          <>
            {authenticatedMenuItems.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-sky-50 cursor-pointer"
                onClick={item.onClick}
              >
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.count && <span className="text-gray-500 text-sm">{item.count}</span>}
              </div>
            ))}

            <div className="mt-6">
              <div className="px-2 mb-2">
                <button 
                  onClick={handleNewThread}
                  className="text-sky-600 hover:bg-sky-50 rounded-lg p-2 w-full text-left"
                >
                  + New project
                </button>
              </div>
              
              {/* Today's Threads */}
              {threads.today.length > 0 && (
                <div className="mt-4">
                  <div className="px-2 text-sm text-gray-500 font-medium mb-1">
                    Today
                  </div>
                  {threads.today.map(thread => (
                    <div 
                      key={thread.id}
                      onClick={() => handleThreadClick(thread.thread_id)}
                      className="px-2 py-1 text-sm hover:bg-sky-50 rounded-lg cursor-pointer"
                    >
                      {thread.title}
                    </div>
                  ))}
                </div>
              )}

              {/* Yesterday's Threads */}
              {threads.yesterday.length > 0 && (
                <div className="mt-4">
                  <div className="px-2 text-sm text-gray-500 font-medium mb-1">
                    Yesterday
                  </div>
                  {threads.yesterday.map(thread => (
                    <div 
                      key={thread.id}
                      onClick={() => handleThreadClick(thread.thread_id)}
                      className="px-2 py-1 text-sm hover:bg-sky-50 rounded-lg cursor-pointer"
                    >
                      {thread.title}
                    </div>
                  ))}
                </div>
              )}

              {/* Previous Week's Threads */}
              {threads.previousWeek.length > 0 && (
                <div className="mt-4">
                  <div className="px-2 text-sm text-gray-500 font-medium mb-1">
                    Previous 7 Days
                  </div>
                  {threads.previousWeek.map(thread => (
                    <div 
                      key={thread.id}
                      onClick={() => handleThreadClick(thread.thread_id)}
                      className="px-2 py-1 text-sm hover:bg-sky-50 rounded-lg cursor-pointer"
                    >
                      {thread.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </aside>
  );
}

export default Sidebar;
