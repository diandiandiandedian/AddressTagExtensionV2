import React from 'react';
import DynamicConnection from './components/DynamicConnection';
import { DynamicContextProvider, mergeNetworks } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import {
  createConfig,
  WagmiProvider,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import Profile from './components/Profile';
import Popup from './popup'

const airdaoTestNetWork = [
    {
      blockExplorerUrls: ['https://testnet.airdao.io/explorer/'],
      chainId: 22040,
      chainName: 'AirDAO Testnet',
      iconUrls: ['/airdaologo.svg'],
      name: 'AirDAO',
      nativeCurrency: {
        decimals: 18,
        name: 'Ambrosus',
        symbol: 'AMB',
      },
      networkId: 22040,
      rpcUrls: ['https://network.ambrosus-test.io'],
      vanityName: 'AirDAO',
    },
  ];

  const airDaoTestnet = {
    id: 22040,
    name: 'AirDAO Testnet',
    network: 'airdao-testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Ambrosus',
      symbol: 'AMB',
    },
    rpcUrls: {
      default: {
        http: ['https://network.ambrosus-test.io'],
      },
      public: {
        http: ['https://network.ambrosus-test.io'],
      },
    },
    blockExplorers: {
      default: { name: 'AirDAO Explorer', url: 'https://airdao.io/explorer/' },
    },
  };

function App() {

  const config = createConfig({
    chains: [mainnet,sepolia,airDaoTestnet],
    multiInjectedProviderDiscovery: false,
    transports: {
      [airDaoTestnet.id]: http(),
    },
  });
  
  const queryClient = new QueryClient();

    return (
        <DynamicContextProvider
        settings={{
            environmentId: '5ca109ab-6d6b-46f4-bca5-bfd72b05157c',
            walletConnectors: [ EthereumWalletConnectors ],
            overrides:{
                evmNetworks: (networks) => mergeNetworks(airdaoTestNetWork, networks),
            }
          }}>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <DynamicWagmiConnector>
                <Profile/>
                {/* <Popup /> */}
              </DynamicWagmiConnector>
            </QueryClientProvider>
          </WagmiProvider>
        </DynamicContextProvider>
    );
}

export default App;
