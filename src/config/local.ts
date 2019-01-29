import {Config} from '@/interfaces/config';

const localIp = '10.0.0.44';

const config: Config = {
  playerUrl: `http://${localIp}:8082`,
  logUrl:  `http://${localIp}:8082/log`,
  connectionCheckUrl: `http://${localIp}:8082/log`,
  updateCheckUrl: `http://${localIp}:4455/updates.json`, //TODO
};

export default config;
