import * as logger from 'electron-log';
import * as crypto from 'crypto';
import { ipcMain } from 'electron';

const address = require('address');

export const getDeviceId = async function() {
  const macAddress = await getMacAsync();
  const shasum = crypto.createHash('sha1');
  shasum.update(macAddress);
  return shasum.digest('hex');
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
