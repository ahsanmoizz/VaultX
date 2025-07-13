// apps/src/components/ChainSwitcher.tsx
import { useSwitchChain, useChainId, useChains } from "wagmi";
import { useState } from "react";

export default function ChainSwitcher() {
  const chainId = useChainId(); // current chain
  const chains = useChains();   // all available chains
  const { switchChain } = useSwitchChain();

  const [selectedId, setSelectedId] = useState(chainId);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = parseInt(e.target.value);
    setSelectedId(newId);
    switchChain({ chainId: newId });
  };
return (
 <div className="font-sans space-y-2">
  <label htmlFor="chain" className="block text-sm text-white font-medium">Select Chain</label>

  <select
    id="chain"
    value={selectedId}
    onChange={handleChange}
    className="w-48 px-3 py-2 bg-black text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-brand-primary"
  >
    {chains.map((chain) => (
      <option key={chain.id} value={chain.id} className="bg-black text-white">{chain.name}</option>
    ))}
  </select>
</div>
);

}
