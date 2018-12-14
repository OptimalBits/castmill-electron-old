import { ipcRenderer } from 'electron';

const Timeout = 50000;

export function createIpcFunction<T, R>(name: string) {
  return (data?: T) => {
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
