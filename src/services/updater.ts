import * as logger from 'electron-log';
import * as updater from 'electron-simple-updater';

//TODO: This should be a configuration
// https://github.com/OptimalBits/castmill-electron/issues/17
const UPDATE_CHECK_URL = 'http://localhost:4455/updates.json';

const isDevelopment = process.env.NODE_ENV !== 'production';

const updatePollInterval = isDevelopment ?
  1 * 60 * 1000
  :
  1 * 60 * 60 * 1000;

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
