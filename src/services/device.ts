import * as logger from 'electron-log';
import * as crypto from 'crypto';
import { app, ipcMain } from 'electron';
import fetch from 'node-fetch';
import { getConfig } from '../config';

interface PlayerInfo {
  version: string;
  channel: string;
}

const address = require('macaddress');

export const getDeviceId = async function() {
  const macAddress = await getMacAsync();
  const shasum = crypto.createHash('sha1');
  shasum.update(macAddress);
  return shasum.digest('hex');
};

export const getConnectionStatus = async function(): Promise<boolean> {
  try {
    const response = await fetch(getConfig().connectionCheckUrl, {
      method: 'POST',
    });

    logger.debug('connection status', response.ok);
    return response.ok;
  } catch (e) {
    logger.error(e);
    return false;
  }
};

function getMacAsync(): Promise<string> {
  return new Promise((resolve, reject) => {
    address.one((err: Error, addr: string) => {
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

export const getPlayerInfo = async function(): Promise<PlayerInfo> {
  const playerInfo = {
    channel: getConfig().updateChannel,
    version: app.getVersion(),
  };

  logger.debug('player info', playerInfo);

  return playerInfo;
};

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

ipcMain.on('getPlayerInfo', async (event: Electron.Event) => {
  const playerInfo = await getPlayerInfo();
  event.sender.send('getPlayerInfo:reply', playerInfo);
});
