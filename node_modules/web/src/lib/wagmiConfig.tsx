// apps/src/lib/wagmiConfig.ts
import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { Chain } from 'wagmi/chains';

const quantumChain: Chain = {
  id: 91191, // Replace with real chain ID
  name: 'Quantum Daily',
  network: 'daily',
  nativeCurrency: {
    name: 'DAILY',
    symbol: 'DLY',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.quantum.network'], // 🔁 Update with real RPC
    },
  },
  blockExplorers: {
    default: {
      name: 'QuantumScan',
      url: 'https://explorer.quantum.network', // 🔁 Update if needed
    },
  },
};

const { chains, publicClient } = configureChains(
  [quantumChain],
  [publicProvider()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});

export { chains };
