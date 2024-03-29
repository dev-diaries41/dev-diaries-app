export const OWNER = process.env.OWNER || '';
export const ECOMMERCE_CONTRACT_ADDRESS = process.env.ECOMMERCE_CONTRACT_ADDRESS as `0x${string}` | undefined;
export const FUNCTION_NAME = 'buy';
export const TEST_AMOUNT = '0.0005'
export const EVENT = 'Paid'

export const ABI =[
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_recipient",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "when",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          }
        ],
        "name": "Paid",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "buy",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "recipient",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "_newRecipient",
            "type": "address"
          }
        ],
        "name": "updateRecipient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]

    export const ERRORS = {
      rejected: 'User rejected the request',
    }

    const productData = {
      productId: '123456',
      name: 'Sample Product',
      description: 'This is a sample product description.',
      price: 10.99,
      chain: 'ETH', 
    };
    
    const orderData = {
      orderId: '789012',
      productId: '123456',
      buyerAddress: '0x123abc',
      chain: 'ETH',
      timestamp: Date.now(),
      quantity: 1,
      totalPrice: 10.99, 
      transactionHash: '0xabcdef123456',
      status: 'completed', 
    };
  
    export const PLACEHOLDER_PRODUCTS = Array.from({length:20}, (index:number) => productData)
    export const PLACEHOLDER_ORDERS = Array.from({length:20}, (index:number) => orderData)
  