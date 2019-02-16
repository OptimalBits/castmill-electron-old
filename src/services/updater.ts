import * as logger from 'electron-log';
import * as updater from 'electron-simple-updater';
import {getConfig} from '../config';

const isDevelopment = process.env.NODE_ENV !== 'production';

const updatePollInterval = isDevelopment ?
  1 * 20 * 1000 // 20 sec
  :
  1 * 60 * 60 * 1000; // 1 hour

const initialCheckDelay = 10 * 1000;

const getArch = (): string => {
  // Somewhat hacky fix for mismatch between process.arch and build arch
  switch (process.arch) {
    case 'arm':
      return 'armv7l';
    case 'x86':
      return 'x86_64';
    default:
      process.arch;
  }
};

const getBuildType = (): string => {
  const platform = process.platform;
  const arch = getArch();

  return `${platform}-${arch}`;
};

export const autoUpdateWhenAvailable = () => {
  updater.init({
    logger,
    url: getConfig().updateCheckUrl,
    build: getBuildType(),
    channel: getConfig().updateChannel,
  });

  const check = () => {
    logger.debug('checking for updates');
    updater.checkForUpdates();
  };

  setInterval(check, updatePollInterval);

  // initial check
  setTimeout(check, initialCheckDelay);

  updater.on('error', (err: Error) => {
    logger.warn('update failed', err);
  });
  updater.on('checking-for-update', () => {
    logger.debug('checking for update');
  });
  updater.on('update-available', (meta: {}) => {
    logger.debug('update available', meta);
  });
  updater.on('update-not-available', () => {
    logger.debug('update not available');
  });
  updater.on('update-downloading', (meta: {}) => {
    logger.debug('update downloading', meta);
  });
  updater.on('update-downloaded', (meta: {}) => {
    logger.debug('update downloaded', meta);
    updater.quitAndInstall();

    // TODO: investigate whether we should schedule a restart here
  });
};
