import React from 'react';
import { Search, Activity } from 'lucide-react';
import Card from './ui/Card';
import InputField from './ui/InputField';
import GradientButton from './ui/GradientButton';
import LoadingSpinner from './ui/LoadingSpinner';

const TransactionSearch = ({ onSearch, loading, searchedTx }) => {
  const [searchTxHash, setSearchTxHash] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTxHash);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-3 rounded-xl">
          <Search size={24} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Search Transaction</h2>
          <p className="text-gray-500">Find transaction details by hash</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Transaction Hash"
          type="text"
          value={searchTxHash}
          onChange={(e) => setSearchTxHash(e.target.value)}
          placeholder="0x..."
          required
        />
        <GradientButton
          type="submit"
          disabled={loading}
          variant="success"
          className="w-full"
        >
          {loading ? <LoadingSpinner /> : <Search size={20} />}
          {loading ? 'Searching...' : 'Search Transaction'}
        </GradientButton>
      </form>

      {searchedTx && (
        <Card className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
            <Activity size={18} />
            Transaction Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">From:</span>
              <span className="font-mono">{searchedTx.from.slice(0, 6)}...{searchedTx.from.slice(-4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To:</span>
              <span className="font-mono">{searchedTx.to.slice(0, 6)}...{searchedTx.to.slice(-4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Value:</span>
              <span className="font-semibold">{searchedTx.value} SHM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hash:</span>
              <span className="font-mono">{searchedTx.hash.slice(0, 6)}...{searchedTx.hash.slice(-4)}</span>
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
};

export default TransactionSearch; 