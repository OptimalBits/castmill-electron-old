import { ipcRenderer } from 'electron';

export const getDeviceId = () => {
  ipcRenderer.send('getDeviceId');
  return waitResponse();
};

function waitResponse() {
  return new Promise<string>(resolve => {
    ipcRenderer.on('getDeviceId:reply', (event: Electron.Event, deviceId: string) =>
      resolve(deviceId),
    );
  });
}
