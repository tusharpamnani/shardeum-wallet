import React, { useState } from 'react';
import { Plus, Users, Calendar, DollarSign, CheckCircle, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const GroupDetail = ({ group, currentUserAddress, onAddExpense, onSettleExpense, onBack, loading }) => {
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMemberName = (address) => {
    const member = group.members.find(m => m.address.toLowerCase() === address.toLowerCase());
    return member ? member.name : `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const calculateBalances = () => {
    const balances = {};
    
    // Initialize balances for all members
    group.members.forEach(member => {
      balances[member.address] = 0;
    });

    // Calculate balances from expenses
    group.expenses.forEach(expense => {
      if (expense.settled) return;

      const splitAmount = expense.amount / expense.splitBetween.length;
      
      // Person who paid gets credited
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
      
      // People who owe get debited
      expense.splitBetween.forEach(memberAddress => {
        balances[memberAddress] = (balances[memberAddress] || 0) - splitAmount;
      });
    });

    return balances;
  };

  const handleSettleExpense = async (expense) => {
    // Check if user is part of this expense and didn't pay for it
    if (expense.paidBy === currentUserAddress) {
      toast.error('You already paid for this expense');
      return;
    }

    if (!expense.splitBetween.includes(currentUserAddress)) {
      toast.error('You are not part of this expense');
      return;
    }

    if (expense.settled) {
      toast.error('This expense is already settled');
      return;
    }

    setSelectedExpense(expense);
    setShowSettlementModal(true);
  };

  const confirmSettlement = async () => {
    if (!selectedExpense) return;

    // Calculate the amount user owes for this specific expense
    const userShare = selectedExpense.amount / selectedExpense.splitBetween.length;
    
    // Create settlement to pay the person who originally paid
    const settlements = [{
      to: selectedExpense.paidBy,
      amount: userShare
    }];

    try {
      await onSettleExpense(group.id, selectedExpense.id, settlements);
      setShowSettlementModal(false);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Settlement failed:', error);
    }
  };

  const totalExpenses = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const settledExpenses = group.expenses.filter(expense => expense.settled).length;
  const balances = calculateBalances();
  const userBalance = balances[currentUserAddress] || 0;

  return (
    <div className="space-y-6">
      {/* Group Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h1>
            {group.description && (
              <p className="text-gray-600 mb-4">{group.description}</p>
            )}
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>Created {formatDate(group.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={16} />
                <span>{group.members.length} members</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onAddExpense}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Total Expenses</span>
            </div>
            <div className="text-xl font-bold text-blue-900">{totalExpenses.toFixed(4)} SHM</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-900">Settled</span>
            </div>
            <div className="text-xl font-bold text-green-900">{settledExpenses}/{group.expenses.length}</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock size={16} className="text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Pending</span>
            </div>
            <div className="text-xl font-bold text-orange-900">{group.expenses.length - settledExpenses}</div>
          </div>

          <div className={`p-4 rounded-lg ${userBalance > 0 ? 'bg-green-50' : userBalance < 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign size={16} className={userBalance > 0 ? 'text-green-600' : userBalance < 0 ? 'text-red-600' : 'text-gray-600'} />
              <span className={`text-sm font-medium ${userBalance > 0 ? 'text-green-900' : userBalance < 0 ? 'text-red-900' : 'text-gray-900'}`}>
                Your Balance
              </span>
            </div>
            <div className={`text-xl font-bold ${userBalance > 0 ? 'text-green-900' : userBalance < 0 ? 'text-red-900' : 'text-gray-900'}`}>
              {userBalance > 0 ? '+' : ''}{userBalance.toFixed(4)} SHM
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {group.members.map((member) => {
            const memberBalance = balances[member.address] || 0;
            
            return (
              <div key={member.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    member.isOwner ? 'bg-shardeum-100 text-shardeum-700' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {member.name}
                      {member.isOwner && <span className="text-xs text-shardeum-600 ml-2">Owner</span>}
                      {member.address === currentUserAddress && <span className="text-xs text-blue-600 ml-2">You</span>}
                    </div>
                    <div className="text-xs text-gray-600 font-mono">
                      {member.address.slice(0, 6)}...{member.address.slice(-4)}
                    </div>
                  </div>
                </div>
                
                <div className={`text-sm font-medium ${
                  memberBalance > 0 ? 'text-green-600' : memberBalance < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {memberBalance > 0 ? '+' : ''}{memberBalance.toFixed(4)} SHM
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses</h3>
        
        {group.expenses.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign size={48} className="text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Expenses Yet</h4>
            <p className="text-gray-600 mb-4">Add your first expense to start splitting costs</p>
            <button
              onClick={onAddExpense}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add First Expense</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {group.expenses.map((expense) => (
              <div
                key={expense.id}
                className={`p-4 border rounded-lg ${
                  expense.settled ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{expense.description}</h4>
                      {expense.settled ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <Clock size={16} className="text-orange-600" />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Paid by: {getMemberName(expense.paidBy)}</div>
                      <div>Split between: {expense.splitBetween.map(addr => getMemberName(addr)).join(', ')}</div>
                      <div>Added: {formatDate(expense.addedAt)}</div>
                      {expense.settled && expense.settledAt && (
                        <div>Settled: {formatDate(expense.settledAt)}</div>
                      )}
                    </div>

                    {!expense.settled && (
                      <div className="mt-3">
                        {/* Show settlement button if current user owes money for this specific expense */}
                        {expense.paidBy !== currentUserAddress && expense.splitBetween.includes(currentUserAddress) && (
                          <button
                            onClick={() => handleSettleExpense(expense)}
                            disabled={loading}
                            className="btn-primary text-sm py-1 px-3 flex items-center space-x-1"
                          >
                            <Send size={14} />
                            <span>Pay Your Share ({(expense.amount / expense.splitBetween.length).toFixed(4)} SHM)</span>
                          </button>
                        )}
                        
                        {/* Show if user already paid */}
                        {expense.paidBy === currentUserAddress && (
                          <div className="text-sm text-green-600 font-medium">
                            ✓ You paid for this expense
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{expense.amount.toFixed(4)} SHM</div>
                    <div className="text-sm text-gray-600">
                      {(expense.amount / expense.splitBetween.length).toFixed(4)} SHM per person
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settlement Confirmation Modal */}
      {showSettlementModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Settlement</h3>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">
                You are about to send SHM payment to settle your share of "{selectedExpense.description}".
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Payment To:</span>
                    <span className="font-semibold">{getMemberName(selectedExpense.paidBy)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Your Share:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {(selectedExpense.amount / selectedExpense.splitBetween.length).toFixed(4)} SHM
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-mono">
                    To: {selectedExpense.paidBy.slice(0, 6)}...{selectedExpense.paidBy.slice(-4)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => {
                  setShowSettlementModal(false);
                  setSelectedExpense(null);
                }}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmSettlement}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;