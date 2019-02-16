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
  const configId: string = process.env.VUE_APP_PLAYER_CONFIG || 'tpd';
  const buildMode: string = process.env.VUE_APP_BUILD_MODE;

  const config: Config = { // copy to prevent editing from "outside"
    ...configs[configId]
  };

  config.updateChannel = buildMode
    ? `${config.updateChannel}-${buildMode}`
    : config.updateChannel;

  logger.debug('config:', configId, config);

  if(!config) {
    logger.debug('defaulting to tpd config', tpdConfig);
    return tpdConfig;
  }

  return config;
}
