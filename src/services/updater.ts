import * as logger from 'electron-log';
import * as updater from 'electron-simple-updater';
import {getConfig} from '../config';

const isDevelopment = process.env.NODE_ENV !== 'production';

const updatePollInterval = isDevelopment ?
  1 * 20 * 1000 // 20 sec
  :
  1 * 60 * 60 * 1000; // 1 hour

export const autoUpdateWhenAvailable = () => {
  updater.init({
    logger,
    url: getConfig().updateCheckUrl,
  });

  setInterval(() => {
    logger.debug('checking for updates');
    updater.checkForUpdates();
  }, updatePollInterval);

  updater.on('update-downloaded', () => {
    logger.debug('update downloaded');
    updater.quitAndInstall();
  });
};
