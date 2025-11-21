export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  SEND = 'SEND',
  CONFIRM = 'CONFIRM',
  SUCCESS = 'SUCCESS',
  FOREST = 'FOREST',
  MAP = 'MAP',
  SETTINGS = 'SETTINGS'
}

export interface User {
  id: string;
  username: string;
  balanceUSDC: number;
  balanceCelo: number;
  treesPlanted: number;
  isBlackFalconMode: boolean;
}

export interface Transaction {
  id: string;
  recipient: string;
  amount: number;
  currency: 'USDC' | 'cUSD';
  timestamp: number;
  treeSpecies: string;
  treeCoords: { lat: number; lng: number };
  carbonOffsetKg: number;
  imageUrl: string; // Satellite image URL
}

export interface CurrencyRate {
  code: string;
  rate: number; // Rate against USD
  symbol: string;
}

export enum Network {
  BASE = 'Base',
  CELO = 'Celo'
}