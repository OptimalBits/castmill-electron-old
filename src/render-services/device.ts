import { ipcRenderer } from 'electron';

const Timeout = 5000;

export const getDeviceId = () => {
  ipcRenderer.send('getDeviceId');
  return waitResponse();
};

function waitResponse() {
  return new Promise<string>((resolve, reject) => {
    ipcRenderer.on(
      'getDeviceId:reply',
      (event: Electron.Event, deviceId: string) => resolve(deviceId),
    );

    delay(Timeout).then(() => reject(new Error('Timeout')));
  });
}

function delay(millis: number) {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve();
    }, millis);
  });
}
