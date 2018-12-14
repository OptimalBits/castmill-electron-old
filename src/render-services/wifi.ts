import { createIpcFunction } from '@/render-services/comm';
import { Network } from '@/interfaces/network';

export const getWifiScan = createIpcFunction<void, Network[]>('getWifiScan');
export const getCurrentConnection = createIpcFunction<void, Network>(
  'getCurrentConnection',
);
export const connect = createIpcFunction<ConnectOpts, string>('connect');
