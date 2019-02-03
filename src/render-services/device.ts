import { createIpcFunction } from '@/render-services/comm';

interface PlayerInfo {
  version: string;
  channel: string;
}

export const getDeviceId = createIpcFunction<void, string>('getDeviceId');
export const getConnectionStatus = createIpcFunction<void, boolean>(
  'getConnectionStatus',
);
export const getPlayerInfo =
  createIpcFunction<void, PlayerInfo>('getPlayerInfo');
