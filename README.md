# castmill-player

Electron based castmill player

## Project setup

The project uses [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html)

The project enforces the use of 
https://www.conventionalcommits.org/en/v1.0.0-beta.2/

via git pre commit hooks.

The most useful information for electron can be found [here](https://electronjs.org/docs)


Support for autolaunch is provided by this [package](https://www.npmjs.com/package/auto-launch)


```
yarn install
```

### Compiles and hot-reloads for development

```
yarn dev
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).


# Installing on DietPI

If you build the player for linux arm architecture, you can install it as a debian package.
However, you need to do a few things:
```bash
$ sudo dpkg --add-architecture armv7l

$ sudo apt-get install gconf2 gconf-service libnotify4 libappindicator1 libxtst6 libnss3 libxss1

$ sudo dpkg -i castmill-player-0.1.0-armv7l.deb
```

# Installing on Ubuntu

It can be installed easily with ubuntus package manager, however following dependencies are needed, at least in Ubuntu 14:
```
$ sudo apt-get install libnss3 libdbus-1-3
```

# Autoupdate

Auto update is handled by this [package](https://www.npmjs.com/package/electron-simple-updater)

The app polls an (at the moment hard-coded) url pointing at a json file. This json
file specifies the download paths of the different versions of the app.

Example:

```js
{
  "linux-arm71-prod": {
    "update": "http://localhost:4455/castmill-player_0.1.0_armv7l.AppImage",
    "install": "http://localhost:4455/castmill-player_0.1.0_armv7l.AppImage",
    "version": "0.1.0"
  }
}
```

If an update is found it is automatically downloaded and installed

