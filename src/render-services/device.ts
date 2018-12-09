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
  const channel = `${name}:reply`;

  return new Promise<R>((resolve, reject) => {
    const handler = (event: Electron.Event, data: R) => resolve(data);

    ipcRenderer.once(channel, handler);

    delay(Timeout).then(() => {
      // remove the listener. Any other listeners on the channel should be left untouched
      ipcRenderer.removeListener(channel, handler);
      reject(new Error('Timeout'));
    });
  });
}

function delay(millis: number) {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve();
    }, millis);
  });
}
