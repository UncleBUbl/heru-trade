import { CurrencyRate, Transaction } from './types';

export const MOCK_RATES: CurrencyRate[] = [
  { code: 'NGN', rate: 1600.50, symbol: '₦' },
  { code: 'KES', rate: 130.20, symbol: 'KSh' },
  { code: 'GHS', rate: 15.80, symbol: 'GH₵' },
  { code: 'ZAR', rate: 18.90, symbol: 'R' },
  { code: 'XOF', rate: 605.00, symbol: 'CFA' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    recipient: '@kwame_tech',
    amount: 50.00,
    currency: 'USDC',
    timestamp: Date.now() - 86400000,
    treeSpecies: 'Acacia Senegal',
    treeCoords: { lat: 14.4974, lng: -14.4524 },
    carbonOffsetKg: 25,
    imageUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: 'tx_2',
    recipient: '+234 801 234 5678',
    amount: 120.00,
    currency: 'cUSD',
    timestamp: Date.now() - 172800000,
    treeSpecies: 'Baobab',
    treeCoords: { lat: 9.0820, lng: 8.6753 },
    carbonOffsetKg: 60,
    imageUrl: 'https://picsum.photos/400/400?random=2'
  }
];

export const FOREST_LOCATIONS = [
  { id: 1, lat: 5.6037, lng: -0.1870, name: "Accra Green Belt" }, // Accra
  { id: 2, lat: 6.5244, lng: 3.3792, name: "Lagos Coastal Restoration" }, // Lagos
  { id: 3, lat: -1.2921, lng: 36.8219, name: "Nairobi National Park Ext" }, // Nairobi
  { id: 4, lat: 14.6928, lng: -17.4467, name: "Dakar Green Wall" }, // Dakar
  { id: 5, lat: -26.2041, lng: 28.0473, name: "Jo'burg Urban Forest" }, // Johannesburg
  { id: 6, lat: 9.0579, lng: 7.4951, name: "Abuja Canopy" }, // Abuja
  { id: 7, lat: 4.0511, lng: 9.7679, name: "Douala Mangroves" }, // Douala
];