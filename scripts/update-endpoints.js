const fs = require('fs');

const URL = 'https://chains.hyperquery.xyz/active_chains';

const RENAME_CONFIG = {
  eth: 'Ethereum Mainnet',
  "polygon-zkevm": "Polygon zkEVM",
  "zksync": "ZKsync",
  // Add other renaming rules here
};

// Filter out staging and fuel chains
const FILTER_ENDPOINTS = [/^staging-/, /fuel/, /temporary/, /delete/];

const HYPERSYNC_COLUMNS = [
  { name: 'Network Name', width: 20 },
  { name: 'Network ID', width: 10 },
  { name: 'URL', width: 83 },
  { name: 'Tier', width: 4 },
  { name: 'Supports Traces', width: 15 }
];

const HYPERRPC_COLUMNS = [
  { name: 'Network Name', width: 20 },
  { name: 'Network ID', width: 10 },
  { name: 'URL', width: 83 },
  { name: 'Supports Traces', width: 15 }
];

const capitalizeAndSplit = (name) => {
  return name.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const generateCommonTableHeader = (columns) => {
  let header = '| ' + columns.map(col => col.name.padEnd(col.width)).join(' | ') + ' |\n';
  header += '| ' + columns.map(col => '-'.repeat(col.width)).join(' | ') + ' |\n';
  return header;
};

const sortAndFilterChains = (data) => {
  return data
    .sort((a, b) => {
      const nameA = RENAME_CONFIG[a.name] || capitalizeAndSplit(a.name);
      const nameB = RENAME_CONFIG[b.name] || capitalizeAndSplit(b.name);
      return nameA.localeCompare(nameB);
    })
    .filter(chain => !FILTER_ENDPOINTS.some(regex => regex.test(chain.name))
    );
};



const getNetworkName = (chain) => RENAME_CONFIG[chain.name] || capitalizeAndSplit(chain.name);

const TICK = '✔️';

const generateTableRow = (columns, values) => {
  return '| ' + columns.map((col, index) => values[index].padEnd(col.width)).join(' | ') + ' |\n';
};

const generateHyperSyncTable = (data) => {
  let table = generateCommonTableHeader(HYPERSYNC_COLUMNS);

  sortAndFilterChains(data).forEach(chain => {
    const networkName = getNetworkName(chain);

    let tier = '🏗️'; // default tier is WIP

    if (chain.tier === 'GOLD') {
      // Other emojis that could be considdered: 🏆, 🎖️, 🏅
      tier = '🥇';
    } else if (chain.tier === 'SILVER') {
      tier = '🥈';
    } else if (chain.tier === 'BRONZE') {
      tier = '🥉';
    } else if (chain.tier === 'EXPERIMENTAL') {
      tier = '🧪';
    } else {
      console.log(`This chain's is not recognised - reverting to WIP tier: ${chain.name} - ${chain.tier}`);
    }

    const supportsTraces = chain.additional_features && chain.additional_features.includes('TRACES') ? TICK : ' ';
    const url = `https://${chain.name}.hypersync.xyz or https://${chain.chain_id}.hypersync.xyz`;

    table += generateTableRow(HYPERSYNC_COLUMNS, [networkName, chain.chain_id.toString(), url, tier, supportsTraces]);
  });

  return table;
};

const generateHyperRPCTable = (data) => {
  let table = generateCommonTableHeader(HYPERRPC_COLUMNS);

  sortAndFilterChains(data).forEach(chain => {
    const networkName = getNetworkName(chain);
    const url = `https://${chain.name}.rpc.hypersync.xyz or https://${chain.chain_id}.rpc.hypersync.xyz`;
    const supportsTraces = chain.additional_features && chain.additional_features.includes('TRACES') ? TICK : ' ';

    table += generateTableRow(HYPERRPC_COLUMNS, [networkName, chain.chain_id.toString(), url, supportsTraces]);
  });

  return table;
};

const updateMarkdownFiles = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    // Update HyperSync file
    const hyperSyncTable = generateHyperSyncTable(data);
    const HYPERSYNC_FILE_PATH = 'docs/HyperSync/hypersync-supported-networks.md';
    let hyperSyncContent = fs.readFileSync(HYPERSYNC_FILE_PATH, 'utf8');

    const hyperSyncRegex = /([\s\S]*?\n\n)\n*\| Network Name.*\| Supports Traces \|\n\| -+.*\| -+ \|\n[\s\S]*?\n*(\n\n[\s\S]*|$)/;
    const hyperSyncMatch = hyperSyncContent.match(hyperSyncRegex);

    if (hyperSyncMatch) {
      const updatedHyperSyncContent = hyperSyncMatch[1] + '\n' + hyperSyncTable + '\n' + hyperSyncMatch[2];
      hyperSyncContent = hyperSyncContent.replace(hyperSyncRegex, updatedHyperSyncContent);
      fs.writeFileSync(HYPERSYNC_FILE_PATH, hyperSyncContent, 'utf8');
      console.log('HyperSync markdown file updated successfully.');
    } else {
      console.log('HyperSync table not found in the markdown file.');
    }

    // Update HyperRPC file
    const hyperRPCTable = generateHyperRPCTable(data);
    const HYPERRPC_FILE_PATH = 'docs/HyperSync/HyperRPC/hyperrpc-url-endpoints.md';
    let hyperRPCContent = fs.readFileSync(HYPERRPC_FILE_PATH, 'utf8');

    const hyperRPCRegex = /([\s\S]*?\n\n)\n*\| Network Name.*\| Supports Traces \|\n\| -+.*\| -+ \|\n[\s\S]*?\n*(\n\n[\s\S]*|$)/;
    const hyperRPCMatch = hyperRPCContent.match(hyperRPCRegex);

    if (hyperRPCMatch) {
      const updatedHyperRPCContent = hyperRPCMatch[1] + '\n' + hyperRPCTable + '\n' + hyperRPCMatch[2];
      hyperRPCContent = hyperRPCContent.replace(hyperRPCRegex, updatedHyperRPCContent);
      fs.writeFileSync(HYPERRPC_FILE_PATH, hyperRPCContent, 'utf8');
      console.log('HyperRPC markdown file updated successfully.');
    } else {
      console.log('HyperRPC table not found in the markdown file.');
    }

  } catch (error) {
    console.error('Error updating markdown files:', error);
  }
};

updateMarkdownFiles();
