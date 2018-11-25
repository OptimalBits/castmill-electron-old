<template>
   <v-dialog v-model="dialog.open" scrollable max-width="500px">
      <warning :frame="frame" :dialog="warning"></warning>
      <v-card>
        <v-toolbar color="teal" dark>
          <v-toolbar-title>Settings</v-toolbar-title>
        </v-toolbar>

        <v-card-text style="height: 700px;">

           <v-list subheader>
          <v-subheader>Player Info</v-subheader>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Online: {{info.online ? 'Yes' : 'No'}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Internet: {{info.internet ? 'Yes' : 'No'}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Device ID: {{info.deviceId}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>
          <v-list subheader two-line>
            <v-subheader>Player Settings</v-subheader>

            <v-list-tile @click="">
              <v-list-tile-action>
                <v-checkbox v-model="autostart"></v-checkbox>
              </v-list-tile-action>

              <v-list-tile-content @click="updateAutostart(!autostart)">
                <v-list-tile-title>Autostart</v-list-tile-title>
                <v-list-tile-sub-title>Player will autostart on next reboot</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="">
              <v-list-tile-action>
                <v-checkbox v-model="options.debug"></v-checkbox>
              </v-list-tile-action>

              <v-list-tile-content @click="options.debug = !options.debug">
                <v-list-tile-title>Debug window</v-list-tile-title>
                <v-list-tile-sub-title>Show the debug window with useful player information</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>

            <v-subheader>Actions</v-subheader>

            <v-list-tile @click="restart()">
              <v-list-tile-content>
                <v-list-tile-title>Restart</v-list-tile-title>
                <v-list-tile-sub-title>Restarts the player</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="quit()">
              <v-list-tile-content>
                <v-list-tile-title>Quit</v-list-tile-title>
                <v-list-tile-sub-title>Exits the playern</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

             <v-list-tile @click="unregister()">
              <v-list-tile-content @click="">
                <v-list-tile-title>Unregister</v-list-tile-title>
                <v-list-tile-sub-title>Unregisters the player</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="dialog.open = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import Store from "electron-store";
const _Store = require("electron").remote.require("electron-store");

import { getDeviceId } from "@/services/device";
import { Frame } from "@/services/frame";

const app = require("electron").remote.app;
const exeFilePath = app.getPath("exe");

import AutoLaunch from "auto-launch";
import Warning from "@/components/warning.vue";

const castmillPlayerAutoLauncher = new AutoLaunch({
  name: "Castmill",
  path: exeFilePath
});

interface Options {
  debug: boolean;
  server: string;
}

interface Info {
  online: boolean;
  internet: boolean;
  deviceId: string;
}

Vue.component('warning', Warning);

@Component({ name: "settings" })
export default class Settings extends Vue {
  @Prop()
  private dialog!: {
    open: boolean;
  };

  @Prop()
  private frame!: Frame;

  warning = { open: false };

  store: Store;

  version = "1.0.0";
  playerName = "Castmill";
  navigator = window.navigator;

  autostart = false;

  options: Options = <Options>{};

  info: Info = {
    online: false,
    internet: false,
    deviceId: ""
  };

  constructor() {
    super();

    this.store = <Store>new _Store({ name: "castmill-config" });

    Object.assign(
      this.options,
      this.store.get("options", {
        debug: false,
        server: "player.castmill.io"
      })
    );

    this.info.internet = navigator.onLine;

    getDeviceId().then(deviceId => (this.info.deviceId = deviceId));

    window.addEventListener("online", () => (this.info.internet = true));
    window.addEventListener("offline", () => (this.info.internet = false));

    castmillPlayerAutoLauncher
      .isEnabled()
      .then(autostart => (this.autostart = autostart));
  }

  @Watch("options", { deep: true })
  updateOptions(val: string, oldVal: string) {
    if (this.options.debug) {
      // toggle is not appropiate, but require changes in the player
      this.frame.toggleDebug();
    }
    this.store.set("options", this.options);
  }

  @Watch("autostart")
  updateAutostart(autostart: boolean) {
    this.autostart = autostart;
    if (autostart) {
      return castmillPlayerAutoLauncher.enable();
    } else {
      return castmillPlayerAutoLauncher.disable();
    }
  }

  restart() {
    window && window.location.reload();
  }

  quit() {
    const remote = require("electron").remote;
    const win = remote.getCurrentWindow();
    win.close();
  }

  unregister() {
    this.warning.open = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>