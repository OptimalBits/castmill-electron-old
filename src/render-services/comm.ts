import { ipcRenderer } from 'electron';

const Timeout = 50000;

export function createIpcFunction<T, R>(name: string) {
  return (data?: T) => {
    ipcRenderer.send(name, data);
    return createIpcResponseHandler<R>(name);
  };
}

function createIpcResponseHandler<R>(name: string) {
  return new Promise<R>((resolve, reject) => {
    ipcRenderer.on(`${name}:reply`, (event: Electron.Event, data: R) =>
      resolve(data),
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
