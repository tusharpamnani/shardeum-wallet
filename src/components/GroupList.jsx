import React from 'react';
import { Plus, Users, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react';

const GroupList = ({ groups, onSelectGroup, onCreateGroup }) => {
  const calculateGroupStats = (group) => {
    const totalExpenses = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const settledExpenses = group.expenses.filter(expense => expense.settled).length;
    const pendingExpenses = group.expenses.length - settledExpenses;
    
    return {
      totalExpenses: totalExpenses.toFixed(4),
      settledExpenses,
      pendingExpenses,
      totalCount: group.expenses.length
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Groups</h2>
          <p className="text-gray-600 mt-1">Manage your expense groups and split bills</p>
        </div>
        <button
          onClick={onCreateGroup}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Group</span>
        </button>
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <div className="card text-center py-12">
          <Users size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Groups Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first expense group to start splitting bills with friends
          </p>
          <button
            onClick={onCreateGroup}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Your First Group</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const stats = calculateGroupStats(group);
            
            return (
              <div
                key={group.id}
                onClick={() => onSelectGroup(group)}
                className="card hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 fade-in"
              >
                {/* Group Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <div className="bg-shardeum-100 p-2 rounded-lg ml-3">
                    <Users size={20} className="text-shardeum-600" />
                  </div>
                </div>

                {/* Group Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Expenses</span>
                    <span className="font-semibold text-gray-900">
                      {stats.totalExpenses} SHM
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Members</span>
                    <span className="font-semibold text-gray-900">
                      {group.members.length}
                    </span>
                  </div>

                  {stats.totalCount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <div className="flex items-center space-x-2">
                        {stats.pendingExpenses > 0 ? (
                          <>
                            <Clock size={14} className="text-orange-500" />
                            <span className="text-orange-600 font-medium">
                              {stats.pendingExpenses} pending
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="text-green-600 font-medium">
                              All settled
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Group Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>Created {formatDate(group.createdAt)}</span>
                  </div>
                  
                  {stats.totalCount > 0 && (
                    <div className="text-xs text-gray-500">
                      {stats.totalCount} expense{stats.totalCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Progress Bar for Settled Expenses */}
                {stats.totalCount > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Settlement Progress</span>
                      <span>{Math.round((stats.settledExpenses / stats.totalCount) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-shardeum-500 to-shardeum-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(stats.settledExpenses / stats.totalCount) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Stats */}
      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Groups</p>
                <p className="text-xl font-semibold text-gray-900">{groups.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-xl font-semibold text-gray-900">
                  {groups.reduce((sum, group) => 
                    sum + group.expenses.reduce((expSum, exp) => expSum + exp.amount, 0), 0
                  ).toFixed(4)} SHM
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Settlements</p>
                <p className="text-xl font-semibold text-gray-900">
                  {groups.reduce((sum, group) => 
                    sum + group.expenses.filter(exp => !exp.settled).length, 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupList; 