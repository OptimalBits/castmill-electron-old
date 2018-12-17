import { createIpcFunction } from '@/render-services/comm';

export const getDeviceId = createIpcFunction<void, string>('getDeviceId');
export const getConnectionStatus = createIpcFunction<void, boolean>(
  'getConnectionStatus',
);
