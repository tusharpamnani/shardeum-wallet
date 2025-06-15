# SHM Splitter - Peer-to-Peer Bill Splitting on Shardeum

A modern web application for splitting group bills and making payments using SHM cryptocurrency on the Shardeum network.

## 🚀 Features

### Core Functionality
- **Create & Join Groups**: Set up expense groups with friends, family, or colleagues
- **Smart Bill Splitting**: Automatic equal splits or custom amount distributions
- **SHM Payments**: Direct cryptocurrency payments using Shardeum's native token
- **Real-time Balances**: Track who owes what with live balance calculations
- **Settlement Management**: Easy one-click payments to settle debts

### Technical Features
- **Shardeum Integration**: Full integration with Shardeum JSON-RPC API
- **MetaMask Support**: Seamless wallet connection and transaction signing
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Updates**: Live network information and transaction status
- **Local Storage**: Persistent group data (upgradeable to backend)

## 🛠 Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Shardeum Network
- **Web3**: Ethers.js v6
- **Wallet**: MetaMask integration
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension
3. **Shardeum Network** configured in MetaMask
4. **SHM tokens** for transactions

### Shardeum Network Configuration

Add Shardeum network to MetaMask with these details:
- **Network Name**: Shardeum
- **RPC URL**: `https://api.shardeum.org`
- **Chain ID**: (Check current chain ID via API)
- **Currency Symbol**: SHM

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd shardeum_bill_splitter
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## 📖 How to Use

### 1. Connect Your Wallet
- Click "Connect Wallet" on the landing page
- Approve MetaMask connection
- Ensure you're on the Shardeum network

### 2. Create a Group
- Click "Create Group" from the dashboard
- Enter group name and description
- Add members by entering their wallet addresses
- Submit to create the group

### 3. Add Expenses
- Select a group from your dashboard
- Click "Add Expense"
- Enter expense details (description, amount, who paid)
- Choose split method (equal or custom)
- Select members to split with
- Submit the expense

### 4. Settle Payments
- View your balance in the group dashboard
- If you owe money (negative balance), click "Settle Payment"
- Confirm the SHM transaction in MetaMask
- Payment will be sent directly to the creditor

## 🔧 API Integration

The application uses the official Shardeum JSON-RPC API methods:

### Core Methods Used
- `eth_chainId` - Get network chain ID
- `eth_gasPrice` - Get current gas prices
- `eth_getBalance` - Check wallet balances
- `eth_getTransactionCount` - Get transaction nonces
- `eth_estimateGas` - Estimate transaction gas
- `eth_sendTransaction` - Send SHM payments
- `eth_getTransactionReceipt` - Check transaction status

### Shardeum-Specific Methods
- `shardeum_getNetworkAccount` - Network configuration
- `shardeum_getNodeList` - Active network nodes
- `shardeum_getCycleInfo` - Network cycle information

## 🏗 Project Structure

```
src/
├── components/           # React components
│   ├── WalletConnect.jsx    # Wallet connection UI
│   ├── GroupList.jsx        # Groups dashboard
│   ├── GroupDetail.jsx      # Group management
│   ├── CreateGroup.jsx      # Group creation form
│   ├── AddExpense.jsx       # Expense addition form
│   └── NetworkInfo.jsx      # Network status display
├── services/            # API services
│   └── shardeumApi.js      # Shardeum blockchain integration
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## 💡 Key Features Explained

### Smart Balance Calculation
The app automatically calculates who owes what by:
1. Tracking all expenses and who paid
2. Calculating each person's share based on split rules
3. Computing net balances (credits - debits)
4. Determining optimal settlement paths

### Settlement Algorithm
- Identifies creditors (positive balance) and debtors (negative balance)
- Matches debtors with creditors for efficient settlements
- Minimizes the number of transactions needed
- Supports partial payments and complex group dynamics

### Security Features
- All transactions require MetaMask approval
- No private keys stored in the application
- Direct blockchain interaction (no intermediaries)
- Transaction verification and receipt tracking

## 🔒 Security Considerations

- **Wallet Security**: Never share your private keys
- **Transaction Verification**: Always verify transaction details in MetaMask
- **Network Verification**: Ensure you're connected to the correct Shardeum network
- **Amount Verification**: Double-check payment amounts before confirming

## 🚧 Future Enhancements

- **Backend Integration**: Replace localStorage with proper database
- **Group Invitations**: Send invite links to join groups
- **Expense Categories**: Categorize expenses for better tracking
- **Export Features**: Download expense reports and summaries
- **Multi-currency Support**: Support for other cryptocurrencies
- **Recurring Expenses**: Set up automatic recurring payments
- **Mobile App**: Native mobile applications for iOS and Android

## 🐛 Troubleshooting

### Common Issues

**Wallet Connection Failed**
- Ensure MetaMask is installed and unlocked
- Check that you're on the Shardeum network
- Refresh the page and try again

**Transaction Failed**
- Check your SHM balance for gas fees
- Verify the recipient address is correct
- Ensure network connectivity

**Group Not Loading**
- Clear browser cache and localStorage
- Check console for error messages
- Verify wallet connection

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your MetaMask configuration
3. Ensure sufficient SHM balance for transactions
4. Try refreshing the application

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Verify Shardeum network status

---

**Built with ❤️ for the Shardeum ecosystem** 