export const ERC20_ABI = [
    {
      inputs: [
        { name: "name", internalType: "string", type: "string" },
        { name: "symbol", internalType: "string", type: "string" },
        { name: "totalSupply", internalType: "uint256", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          indexed: true,
          name: "owner",
          internalType: "address",
          type: "address",
        },
        {
          indexed: true,
          name: "spender",
          internalType: "address",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          internalType: "uint256",
          type: "uint256",
        },
      ],
      name: "Approval",
      anonymous: false,
      type: "event",
    },
    {
      inputs: [
        {
          indexed: true,
          name: "previousOwner",
          internalType: "address",
          type: "address",
        },
        {
          indexed: true,
          name: "newOwner",
          internalType: "address",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      anonymous: false,
      type: "event",
    },
    {
      inputs: [
        { indexed: true, name: "from", internalType: "address", type: "address" },
        { indexed: true, name: "to", internalType: "address", type: "address" },
        {
          indexed: false,
          name: "value",
          internalType: "uint256",
          type: "uint256",
        },
      ],
      name: "Transfer",
      anonymous: false,
      type: "event",
    },
    {
      outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
      inputs: [],
      name: "MODE_NORMAL",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
      inputs: [],
      name: "MODE_TRANSFER_CONTROLLED",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
      inputs: [],
      name: "MODE_TRANSFER_RESTRICTED",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
      inputs: [],
      name: "_mode",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
      inputs: [
        { name: "owner", internalType: "address", type: "address" },
        { name: "spender", internalType: "address", type: "address" },
      ],
      name: "allowance",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "bool", type: "bool" }],
      inputs: [
        { name: "spender", internalType: "address", type: "address" },
        { name: "amount", internalType: "uint256", type: "uint256" },
      ],
      name: "approve",
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
      inputs: [{ name: "account", internalType: "address", type: "address" }],
      name: "balanceOf",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
      inputs: [],
      name: "decimals",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "bool", type: "bool" }],
      inputs: [
        { name: "spender", internalType: "address", type: "address" },
        { name: "subtractedValue", internalType: "uint256", type: "uint256" },
      ],
      name: "decreaseAllowance",
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "bool", type: "bool" }],
      inputs: [
        { name: "spender", internalType: "address", type: "address" },
        { name: "addedValue", internalType: "uint256", type: "uint256" },
      ],
      name: "increaseAllowance",
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "string", type: "string" }],
      inputs: [],
      name: "name",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "address", type: "address" }],
      inputs: [],
      name: "owner",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [],
      inputs: [],
      name: "renounceOwnership",
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      outputs: [],
      inputs: [{ name: "v", internalType: "uint256", type: "uint256" }],
      name: "setMode",
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "string", type: "string" }],
      inputs: [],
      name: "symbol",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
      inputs: [],
      name: "totalSupply",
      stateMutability: "view",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "bool", type: "bool" }],
      inputs: [
        { name: "to", internalType: "address", type: "address" },
        { name: "amount", internalType: "uint256", type: "uint256" },
      ],
      name: "transfer",
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      outputs: [{ name: "", internalType: "bool", type: "bool" }],
      inputs: [
        { name: "from", internalType: "address", type: "address" },
        { name: "to", internalType: "address", type: "address" },
        { name: "amount", internalType: "uint256", type: "uint256" },
      ],
      name: "transferFrom",
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      outputs: [],
      inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
      name: "transferOwnership",
      stateMutability: "nonpayable",
      type: "function",
    },
];
