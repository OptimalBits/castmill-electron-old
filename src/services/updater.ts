import * as logger from 'electron-log';
import * as updater from 'electron-simple-updater';

//TODO: This should be a configuration
// https://github.com/OptimalBits/castmill-electron/issues/17
const UPDATE_CHECK_URL = 'http://10.0.0.44:4455/updates.json';

const isDevelopment = process.env.NODE_ENV !== 'production';

const updatePollInterval = isDevelopment ?
  1 * 20 * 1000 // 20 sec
  :
  1 * 60 * 60 * 1000; // 1 hour

export const autoUpdateWhenAvailable = () => {
  updater.init({
    logger,
    url: UPDATE_CHECK_URL
  });

  setInterval(() => {
    logger.debug('checking for updates');
    updater.checkForUpdates();
  }, updatePollInterval);
};
