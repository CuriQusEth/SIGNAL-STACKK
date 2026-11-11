import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Base Denim Network Specification (Chain ID 8453, 200ms canonical blocks)
export const BASE_CHAIN_ID = 8453;
export const DENIM_BLOCK_TIME_MS = 200;
export const BASE_RPC_URL = 'https://mainnet.base.org';
export const BASE_EXPLORER_URL = 'https://basescan.org';

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http(BASE_RPC_URL, {
      batch: true,
      retryCount: 3,
    }),
  },
  pollingInterval: DENIM_BLOCK_TIME_MS,
})

