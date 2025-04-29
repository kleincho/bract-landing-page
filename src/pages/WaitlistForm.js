import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function WaitlistForm() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    background: '',
    interests: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    // Save to database/email list
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-20">
      <div className="max-w-xl mx-auto px-6">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 text-sky-600 hover:text-sky-700 flex items-center"
        >
          <span className="mr-2">←</span> Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Join the Waitlist
          <br />
          <span className="text-sky-600">
            {type === 'college' ? 'College Admissions' : 'Finance Recruiting'}
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Background</label>
            <textarea
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              rows="3"
              value={formData.background}
              onChange={(e) => setFormData({...formData, background: e.target.value})}
              placeholder={type === 'college' ? 
                "Tell us about your academic background..." : 
                "Tell us about your professional background..."}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">What are you most interested in?</label>
            <textarea
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              rows="3"
              value={formData.interests}
              onChange={(e) => setFormData({...formData, interests: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium"
          >
            Join Waitlist
          </button>
        </form>
      </div>
    </div>
  );
}

export default WaitlistForm;
