import React, { useState } from 'react';
import { Plus, DollarSign, Users, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';

const AddExpense = ({ group, onAddExpense, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitType: 'equal', // 'equal' or 'custom'
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [customSplits, setCustomSplits] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberToggle = (memberAddress) => {
    setSelectedMembers(prev => {
      const isSelected = prev.includes(memberAddress);
      if (isSelected) {
        return prev.filter(addr => addr !== memberAddress);
      } else {
        return [...prev, memberAddress];
      }
    });
  };

  const handleCustomSplitChange = (memberAddress, amount) => {
    setCustomSplits(prev => ({
      ...prev,
      [memberAddress]: parseFloat(amount) || 0
    }));
  };

  const getMemberName = (address) => {
    const member = group.members.find(m => m.address === address);
    return member ? member.name : address.slice(0, 6) + '...';
  };

  const calculateSplitAmounts = () => {
    const totalAmount = parseFloat(formData.amount) || 0;
    
    if (formData.splitType === 'equal') {
      const perPersonAmount = totalAmount / selectedMembers.length;
      return selectedMembers.reduce((acc, address) => {
        acc[address] = perPersonAmount;
        return acc;
      }, {});
    } else {
      return customSplits;
    }
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      toast.error('Please enter an expense description');
      return false;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return false;
    }

    if (!formData.paidBy) {
      toast.error('Please select who paid for this expense');
      return false;
    }

    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member to split with');
      return false;
    }

    if (formData.splitType === 'custom') {
      const totalCustomAmount = Object.values(customSplits).reduce((sum, amount) => sum + (amount || 0), 0);
      const expenseAmount = parseFloat(formData.amount);
      
      if (Math.abs(totalCustomAmount - expenseAmount) > 0.01) {
        toast.error('Custom split amounts must equal the total expense amount');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const expenseData = {
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        paidBy: formData.paidBy,
        splitBetween: selectedMembers,
        splitType: formData.splitType,
        splitAmounts: calculateSplitAmounts()
      };

      await onAddExpense(expenseData);
    } catch (error) {
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const totalCustomAmount = Object.values(customSplits).reduce((sum, amount) => sum + (amount || 0), 0);
  const expenseAmount = parseFloat(formData.amount) || 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-shardeum-100 p-3 rounded-lg">
            <DollarSign size={24} className="text-shardeum-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Expense</h2>
            <p className="text-gray-600">Add an expense to {group.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expense Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Expense Details</h3>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Dinner at restaurant, Gas for trip, Groceries"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (SHM) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.0000"
                step="0.0001"
                min="0"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-2">
                Paid by *
              </label>
              <select
                id="paidBy"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select who paid</option>
                {group.members.map((member) => (
                  <option key={member.address} value={member.address}>
                    {member.name} {member.address === group.createdBy ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Split Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Split Configuration</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How should this be split?
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="splitType"
                    value="equal"
                    checked={formData.splitType === 'equal'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Split equally among selected members</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="splitType"
                    value="custom"
                    checked={formData.splitType === 'custom'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Custom split amounts</span>
                </label>
              </div>
            </div>

            {/* Member Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Split between these members:
              </label>
              <div className="space-y-2">
                {group.members.map((member) => (
                  <div key={member.address} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.address)}
                        onChange={() => handleMemberToggle(member.address)}
                        className="rounded"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {member.name}
                          {member.address === group.createdBy && <span className="text-xs text-blue-600 ml-2">You</span>}
                        </div>
                        <div className="text-xs text-gray-600 font-mono">
                          {member.address.slice(0, 6)}...{member.address.slice(-4)}
                        </div>
                      </div>
                    </div>
                    
                    {formData.splitType === 'custom' && selectedMembers.includes(member.address) && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="0.0000"
                          step="0.0001"
                          min="0"
                          value={customSplits[member.address] || ''}
                          onChange={(e) => handleCustomSplitChange(member.address, e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-sm text-gray-600">SHM</span>
                      </div>
                    )}
                    
                    {formData.splitType === 'equal' && selectedMembers.includes(member.address) && expenseAmount > 0 && (
                      <div className="text-sm text-gray-600">
                        {(expenseAmount / selectedMembers.length).toFixed(4)} SHM
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Split Summary */}
            {selectedMembers.length > 0 && expenseAmount > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Calculator size={16} className="text-blue-600" />
                  <h4 className="font-medium text-blue-900">Split Summary</h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Amount:</span>
                    <span className="font-semibold text-blue-900">{expenseAmount.toFixed(4)} SHM</span>
                  </div>
                  
                  {formData.splitType === 'equal' ? (
                    <div className="flex justify-between">
                      <span className="text-blue-700">Per Person:</span>
                      <span className="font-semibold text-blue-900">
                        {(expenseAmount / selectedMembers.length).toFixed(4)} SHM
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Custom Total:</span>
                        <span className={`font-semibold ${
                          Math.abs(totalCustomAmount - expenseAmount) < 0.01 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {totalCustomAmount.toFixed(4)} SHM
                        </span>
                      </div>
                      {Math.abs(totalCustomAmount - expenseAmount) > 0.01 && (
                        <div className="text-red-600 text-xs">
                          ⚠️ Custom amounts must equal total expense amount
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-blue-700">Split Among:</span>
                    <span className="font-semibold text-blue-900">{selectedMembers.length} members</span>
                  </div>
                </div>
              </div>
            )}
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
              disabled={loading || selectedMembers.length === 0}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Add Expense</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense; 