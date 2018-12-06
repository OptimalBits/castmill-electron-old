import { ipcRenderer } from 'electron';

const Timeout = 5000;

export const getDeviceId = createIpcFunction<void, string>('getDeviceId');
export const getConnectionStatus = createIpcFunction<void, boolean>('getConnectionStatus');

function createIpcFunction<T, R>(name: string, data?: T) {
  return () => {
    ipcRenderer.send(name, data);
    return createIpcResponseHandler<R>(name);
  };
}

function createIpcResponseHandler<R>(name: string) {
  return new Promise<R>((resolve, reject) => {
    ipcRenderer.on(
      `${name}:reply`,
      (event: Electron.Event, data: R) => resolve(data),
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
