module.exports = {
    // File processing config
    CHUNK_SIZE: process.env.FILE_CHUNK_SIZE || 1024 * 1024, // 1MB
    TEMP_DIR: process.env.FILE_TEMP_DIR || 'temp',
    
    // Security settings
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 50 * 1024 * 1024, // 50MB
    ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,xls,xlsx,jpg,jpeg,png').split(','),
    
    // Blockchain anchoring settings
    BLOCKCHAIN_ANCHORING_ENABLED: process.env.BLOCKCHAIN_ANCHORING_ENABLED === 'true',
    BLOCKCHAIN_NETWORK: process.env.BLOCKCHAIN_NETWORK || 'ethereum',
    
    // Ethereum settings
    ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,
    ETHEREUM_PRIVATE_KEY: process.env.ETHEREUM_PRIVATE_KEY,
    ETHEREUM_CONTRACT_ADDRESS: process.env.ETHEREUM_CONTRACT_ADDRESS,
    
    // Arweave settings
    ARWEAVE_KEY_FILE: process.env.ARWEAVE_KEY_FILE,
    
    // Filecoin settings
    FILECOIN_API_URL: process.env.FILECOIN_API_URL,
    FILECOIN_TOKEN: process.env.FILECOIN_TOKEN
  };
  