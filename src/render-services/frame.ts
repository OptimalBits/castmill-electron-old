import { getDeviceId } from './device';

const VERSION = '1.0.0';
const PLAYER_URL = 'https://player.castmill.com';

// If no ping during 30 seconds, the iframe may have crashed.
const MAX_IFRAME_TIMEOUT = 30000;

// No more than 512Mb allowed for the player
const MAX_MEMORY_USAGE = 384 * 1024 * 1024;

interface HTMLIFrameElementExtended extends HTMLIFrameElement {
  allow: string;
}

export class Frame {
  iframe: HTMLIFrameElementExtended;

  lastPing = Date.now();
  playerReady = false;
  playerName = '';

  constructor(el: HTMLElement) {
    this.iframe = this.createIFrame(el) as HTMLIFrameElementExtended;

    this.iframe.addEventListener('load', () => {
      //
      // Check if the iframe has crashed or memory is to high
      //
      this.checkPlayerTimeout(MAX_IFRAME_TIMEOUT / 2);
    });

    window.addEventListener('message', async evt => {
      const msg = evt.data;

      console.log('MESSAGE', msg);

      if (typeof msg !== 'string') {
        return;
      }

      // Check if the message contains the player name:
      const NAME_PREFIX = 'player_name:';
      if (msg.indexOf('player_name:') === 0) {
        this.playerName = msg.substr(NAME_PREFIX.length);
        // updateInfo();
      } else {
        //
        // Handle other messages
        //
        switch (msg) {
          case 'getEnvironment':
            const deviceId = await getDeviceId();
            const env = {
              deviceId,
              versionStr: `Castmill-Player-Electron-${VERSION}`,
              model: 'Windows',
            };
            this.postMessage(JSON.stringify(env), '*');
            break;
          case 'alive':
            this.lastPing = Date.now();
            break;
          case 'player_ready':
            this.playerReady = true;
            break;
        }
      }
    });
  }

  toggleDebug() {
    if (this.iframe) {
      this.postMessage('console', '*');
    }
  }

  unregister() {
    if (this.iframe) {
      this.postMessage('delete', '*');
    }
  }

  private postMessage(msg: string, val: string) {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(msg, val);
    }
  }

  private createIFrame(el: HTMLElement): HTMLIFrameElement {
    const iframe = document.createElement(
      'iframe',
    ) as HTMLIFrameElementExtended;
    iframe.id = 'frame';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.allow = 'geolocation';
    iframe.src = PLAYER_URL;
    el.appendChild(iframe);

    return iframe;
  }

  private checkPlayerTimeout(timeout: number) {
    setTimeout(() => {
      const memory = process.memoryUsage();
      const delta = Date.now() - this.lastPing;

      console.log(memory);
      console.log(delta);

      if (delta > MAX_IFRAME_TIMEOUT || memory.heapUsed > MAX_MEMORY_USAGE) {
        if (this.iframe && this.iframe.contentWindow) {
          this.iframe.contentWindow.location.reload(true);
        }
      }
      this.checkPlayerTimeout(timeout);
    }, timeout);
  }
}
