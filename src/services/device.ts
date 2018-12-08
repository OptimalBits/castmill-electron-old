import * as logger from 'electron-log';
import * as crypto from 'crypto';
import { ipcMain } from 'electron';
import fetch from 'node-fetch';

const CONNECTION_CHECK_URL = 'https://player.castmill.com/log';

const address = require('address');

export const getDeviceId = async function() {
  const macAddress = await getMacAsync();
  const shasum = crypto.createHash('sha1');
  shasum.update(macAddress);
  return shasum.digest('hex');
};

export const getConnectionStatus = async function(): Promise<boolean> {
  try {
    const response = await fetch(CONNECTION_CHECK_URL, {
      method: 'POST',
    });

    logger.debug('connection status', response.ok);
    return response.ok;
  } catch(e) {
    logger.error(e);
    return false;
  }
};

function getMacAsync(): Promise<string> {
  return new Promise((resolve, reject) => {
    address.mac((err: Error, addr: string) => {
      if (err) {
        logger.error('Get Mac errored', err);
        reject(err);
      } else {
        logger.debug('Get Mac returned %s', addr);
        resolve(addr);
      }
    });
  });
}

//
// Listen to renderer
//
ipcMain.on('getDeviceId', async (event: Electron.Event) => {
  const deviceId = await getDeviceId();
  event.sender.send('getDeviceId:reply', deviceId);
});

ipcMain.on('getConnectionStatus', async (event: Electron.Event) => {
  const connected = await getConnectionStatus();
  event.sender.send('getConnectionStatus:reply', connected);
});
