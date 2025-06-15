import React, { useState } from 'react';
import { Plus, X, Users, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateGroup = ({ onCreateGroup, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMember = () => {
    if (!newMember.name.trim() || !newMember.address.trim()) {
      toast.error('Please enter both name and wallet address');
      return;
    }

    // Basic Ethereum address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(newMember.address)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    // Check for duplicate addresses
    if (members.some(member => member.address.toLowerCase() === newMember.address.toLowerCase())) {
      toast.error('This address is already added');
      return;
    }

    setMembers(prev => [...prev, {
      ...newMember,
      id: Date.now().toString(),
      isOwner: false
    }]);

    setNewMember({ name: '', address: '' });
    toast.success('Member added successfully');
  };

  const removeMember = (memberId) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (members.length === 0) {
      toast.error('Please add at least one member');
      return;
    }

    setLoading(true);
    
    try {
      await onCreateGroup({
        name: formData.name.trim(),
        description: formData.description.trim(),
        members: members
      });
    } catch (error) {
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-shardeum-100 p-3 rounded-lg">
            <Users size={24} className="text-shardeum-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
            <p className="text-gray-600">Set up a new expense group to split bills</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Group Details</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Weekend Trip, Office Lunch, Roommates"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of what this group is for..."
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* Add Members */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Members</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-2">
                    Member Name
                  </label>
                  <input
                    type="text"
                    id="memberName"
                    name="name"
                    value={newMember.name}
                    onChange={handleMemberInputChange}
                    placeholder="Enter member name"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="memberAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    id="memberAddress"
                    name="address"
                    value={newMember.address}
                    onChange={handleMemberInputChange}
                    placeholder="0x..."
                    className="input-field font-mono text-sm"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={addMember}
                className="btn-secondary flex items-center space-x-2"
              >
                <UserPlus size={16} />
                <span>Add Member</span>
              </button>
            </div>

            {/* Members List */}
            {members.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Group Members ({members.length})</h4>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600 font-mono">
                          {member.address.slice(0, 6)}...{member.address.slice(-4)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">You are the group owner</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    You'll be automatically added as a member and can manage the group settings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || members.length === 0}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Create Group</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">💡 Tips for creating groups:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Make sure all members have SHM tokens for payments</li>
          <li>• Double-check wallet addresses to avoid payment errors</li>
          <li>• Use descriptive names to easily identify your groups</li>
          <li>• You can add more members later from the group settings</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateGroup; 