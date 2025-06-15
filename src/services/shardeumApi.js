import { ethers } from 'ethers';

class ShardeumAPI {
  constructor() {
    this.rpcUrl = 'https://api-testnet.shardeum.org'; // Update to mainnet if needed
    this.provider = null;
    this.signer = null;
    this.txHistory = {}; // in-memory mock transaction log
  }

  async initialize() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      await this.provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();
      return true;
    } else {
      throw new Error('Wallet not found. Please install MetaMask or a compatible wallet.');
    }
  }

  async getCurrentAddress() {
    if (!this.signer) throw new Error('Wallet not connected');
    return await this.signer.getAddress();
  }

  async getBalanceOf(address) {
    const res = await fetch(this.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
        jsonrpc: '2.0'
      })
    });
    const data = await res.json();
    return ethers.formatEther(data.result);
  }

  async getMyBalance() {
    const myAddress = await this.getCurrentAddress();
    return await this.getBalanceOf(myAddress);
  }

  async sendSHM(toAddress, amount) {
    if (!this.signer) throw new Error('Wallet not connected');
    const value = ethers.parseEther(amount.toString());
    const gasPrice = await this.getGasPrice();

    const tx = await this.signer.sendTransaction({
      to: toAddress,
      value,
      gasPrice
    });

    // Store in-memory tx log
    const sender = await this.getCurrentAddress();
    if (!this.txHistory[sender]) this.txHistory[sender] = [];
    this.txHistory[sender].push({
      to: toAddress,
      amount,
      hash: tx.hash,
      timestamp: Date.now()
    });

    return tx.hash;
  }

  async getGasPrice() {
    const res = await fetch(this.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'eth_gasPrice', id: 1, jsonrpc: '2.0' })
    });
    const data = await res.json();
    return data.result;
  }

  async getTransactionHistory() {
    const address = await this.getCurrentAddress();
    return this.txHistory[address] || [];
  }

  formatSHM(wei) {
    return ethers.formatEther(wei);
  }

  parseSHM(shm) {
    return ethers.parseEther(shm.toString());
  }
}

export default new ShardeumAPI();
