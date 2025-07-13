import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider, http } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Common chains
import {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  avalanche,
  fantom,
  celo,
  gnosis,
  zkSync,
    sepolia,
} from "wagmi/chains";

const queryClient = new QueryClient();

const DAILY_RPC = import.meta.env.VITE_RPC_URL;

// 🧩 Custom Daily Network (Your Own Chain)
const dailyNetwork = {
  id: 1337,
  name: "Daily Network",
  nativeCurrency: {
    name: "DAILY",
    symbol: "DLY",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [DAILY_RPC] },
    public: { http: [DAILY_RPC] },
  },
};

const config = getDefaultConfig({
  appName: "Daily Multisig",
  projectId: "71ba8acbe9d9e06bd5c8254301e2213b", // replace with actual WalletConnect project ID
  chains: [
    dailyNetwork,
    mainnet,
    polygon,
    arbitrum,
    optimism,
    base,
    avalanche,
    fantom,
    celo,
    gnosis,
    zkSync,
      sepolia,
  ],
  transports: {
     1337: http(import.meta.env.VITE_RPC_DAILY),
  1: http(import.meta.env.VITE_RPC_MAINNET),
  137: http(import.meta.env.VITE_RPC_POLYGON),
   42161: http(import.meta.env.VITE_RPC_ARBITRUM),
  10: http(import.meta.env.VITE_RPC_OPTIMISM),
  8453: http(import.meta.env.VITE_RPC_BASE),
  43114: http(import.meta.env.VITE_RPC_AVALANCHE),
  250: http(import.meta.env.VITE_RPC_FANTOM),
  42220: http(import.meta.env.VITE_RPC_CELO),
  100: http(import.meta.env.VITE_RPC_GNOSIS),
  324: http(import.meta.env.VITE_RPC_ZKSYNC),
    11155111: http(import.meta.env.VITE_RPC_SEPOLIA), 
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
