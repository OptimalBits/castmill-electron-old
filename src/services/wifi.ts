import { ipcMain } from 'electron';
import { Network } from '@/interfaces/network';

export const wifi = require('node-wifi');

ipcMain.on('getWifiScan', async (event: Electron.Event) => {
  const scan: Network[] = await wifi.scan();
  event.sender.send('getWifiScan:reply', scan);
});

ipcMain.on('getCurrentConnection', async (event: Electron.Event) => {
  const current: Network[] = await wifi.getCurrentConnections();
  event.sender.send('getCurrentConnection:reply', current[0]);
});

ipcMain.on('connect', async (event: Electron.Event, opts: ConnectOpts) => {
  try {
    const result = await wifi.connect(opts);
    event.sender.send('connect:reply', result);
  } catch (err) {
    console.error('Error?', err);
    event.sender.send('connect:reply', err.message);
  }
});
