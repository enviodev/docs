const fs = require('fs');

const url = 'https://chains.hyperquery.xyz/active_chains';

// TODO: we could enrich data for each chain from the data from https://chainid.network/chains_mini.json or https://chainid.network/chains.json
const renameConfig = {
  eth: 'Ethereum Mainnet',
  "polygon-zkevm": "Polygon zkEVM",
  "zksync": "ZKsync",
  // Add other renaming rules here
};

const filterEndpoints = [/^staging-/];

const capitalizeAndSplit = (name) => {
  return name.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const generateCommonTableHeader = (columns) => {
  let header = '| ' + columns.join(' | ') + ' |\n';
  header += '| ' + columns.map(() => '-'.repeat(16)).join(' | ') + ' |\n';
  return header;
};

const sortAndFilterChains = (data) => {
  return data
    .sort((a, b) => {
      const nameA = renameConfig[a.name] || capitalizeAndSplit(a.name);
      const nameB = renameConfig[b.name] || capitalizeAndSplit(b.name);
      return nameA.localeCompare(nameB);
    })
    .filter(chain => !filterEndpoints.some(regex => regex.test(chain.name)));
};

const getNetworkName = (chain) => renameConfig[chain.name] || capitalizeAndSplit(chain.name);

const generateTableRow = (columns) => {
  return '| ' + columns.join(' | ') + ' |\n';
};

const generateHyperSyncTable = (data) => {
  const columns = ['Network Name', 'Network ID', 'URL', 'Tier', 'Supports Traces'];
  let table = generateCommonTableHeader(columns);

  sortAndFilterChains(data).forEach(chain => {
    const networkName = getNetworkName(chain);
    const tier = chain.tier === 'paid-rpc' ? 'gold' : 'bronze';
    const supportsTraces = chain.additional_features && chain.additional_features.includes('TRACES') ? '✔️' : ' ';
    const url = `https://${chain.name}.hypersync.xyz or https://${chain.chain_id}.hypersync.xyz`;

    table += generateTableRow([networkName, chain.chain_id, url, tier, supportsTraces]);
  });

  return table;
};

const generateHyperRPCTable = (data) => {
  const columns = ['Network Name', 'Network ID', 'URL'];
  let table = generateCommonTableHeader(columns);

  sortAndFilterChains(data).forEach(chain => {
    const networkName = getNetworkName(chain);
    const url = `https://${chain.name}.rpc.hypersync.xyz or https://${chain.chain_id}.rpc.hypersync.xyz`;

    table += generateTableRow([
      networkName.padEnd(16),
      chain.chain_id.toString().padEnd(10),
      url.padEnd(70)
    ]);
  });

  return table;
};

const updateMarkdownFiles = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Update HyperSync file
    const hyperSyncTable = generateHyperSyncTable(data);
    const hyperSyncFilePath = 'docs/HyperSync/hypersync-url-endpoints.md';
    let hyperSyncContent = fs.readFileSync(hyperSyncFilePath, 'utf8');
    hyperSyncContent = hyperSyncContent.replace(
      /\| Network Name\s+\| Network ID\s+\| URL\s+\| Tier\s+\| Supports Traces \|\n\| ---------------- \| ---------- \| --- \| ---- \| --------------- \|\n[\s\S]*?\n(?=\n|$)/,
      hyperSyncTable
    );
    fs.writeFileSync(hyperSyncFilePath, hyperSyncContent, 'utf8');
    console.log('HyperSync markdown file updated successfully.');

    // Update HyperRPC file
    const hyperRPCTable = generateHyperRPCTable(data);
    const hyperRPCFilePath = 'docs/HyperSync/HyperRPC/hyperrpc-url-endpoints.md';
    let hyperRPCContent = fs.readFileSync(hyperRPCFilePath, 'utf8');
    hyperRPCContent = hyperRPCContent.replace(
      /\| Network Name\s+\| Network ID\s+\| URL\s+\|\n\| ---------------- \| ---------- \| ---------------------------------------------------------------------- \|\n[\s\S]*?\n(?=\n|$)/,
      hyperRPCTable
    );
    fs.writeFileSync(hyperRPCFilePath, hyperRPCContent, 'utf8');
    console.log('HyperRPC markdown file updated successfully.');

  } catch (error) {
    console.error('Error updating markdown files:', error);
  }
};

updateMarkdownFiles();
