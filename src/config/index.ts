import * as logger from 'electron-log';
import {Config} from '@/interfaces/config';
import tpdConfig from './tpd';
import castmillConfig from './castmill';
import whitelabelConfig from './whitelabel';
import localConfig from './local';

const configs: Record<string, Config> = {
  tpd: tpdConfig,
  castmill: castmillConfig,
  whitelabel: whitelabelConfig,
  local: localConfig,
};

export function getConfig(): Config {
  const configId: string = process.env.VUE_APP_PLAYER_CONFIG;
  const config = configs[configId];

  logger.debug('config:', configId, config);

  if(!config) {
    logger.debug('defaulting to tpd config', tpdConfig);
    return tpdConfig;
  }

  return config;
}
