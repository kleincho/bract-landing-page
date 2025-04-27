import React, { useState } from 'react';

function ProfileModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '',
    university: '',
    major: '',
    recruitingStatus: 'seeking', // Default value
    targetRole: '',
    targetCompanies: '',
    preferredLocation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Update Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                Personal Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Major
                  </label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="YYYY"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                Career Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recruiting Status
                </label>
                <select
                  value={formData.recruitingStatus}
                  onChange={(e) => setFormData({ ...formData, recruitingStatus: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="seeking">Actively Seeking</option>
                  <option value="open">Open to Opportunities</option>
                  <option value="incoming">Incoming Position</option>
                  <option value="employed">Currently Employed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Role
                </label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., Investment Banking Analyst"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Companies
                </label>
                <input
                  type="text"
                  value={formData.targetCompanies}
                  onChange={(e) => setFormData({ ...formData, targetCompanies: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., Goldman Sachs, JP Morgan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={formData.preferredLocation}
                  onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., New York, London, Hong Kong"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
