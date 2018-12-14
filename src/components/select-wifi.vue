<template>
  <div>
    <connect-wifi :network="currentNetwork" :dialog="connectWifi" @cancel="cancelWifi()"></connect-wifi>
    <div v-if="wifi.scanning" class="progress-wrapper">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-if="!wifi.scanning">
      <v-radio-group v-model="wifiGroup" :mandatory="false">
        <v-radio
          v-for="network in wifi.networks"
          :key="network.ssid"
          :label="network.ssid"
          :value="network.ssid"
          :disabled="network.ssid == wifiGroup"
          @change="selectNetwork(network)"
        ></v-radio>
      </v-radio-group>
      <v-fab-transition>
        <v-btn color="gray" small dark absolute top right fab>
          <v-icon @click="refreshWifi()">refresh</v-icon>
        </v-btn>
      </v-fab-transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ConnectWifi from '@/components/connect-wifi.vue';
import { Network } from '@/interfaces/network';

import { getWifiScan, getCurrentConnection } from '@/render-services/wifi';

Vue.component('connect-wifi', ConnectWifi);

interface Wifi {
  scanning: boolean;
  networks: Network[];
}

@Component({ name: 'select-wifi' })
export default class SelectWifi extends Vue {
  @Prop()
  private dialog!: {
    open: false;
  };

  connectWifi = { open: false };

  wifi: Wifi = {
    scanning: false,
    networks: [],
  };

  wifiGroup = '';
  oldWifiGroup = '';

  mounted() {
    this.refreshWifi();
  }

  selectNetwork(network: Network) {
    this.oldWifiGroup = this.wifiGroup;
    this.connectWifi.open = true;
  }

  get currentNetwork() {
    const network = this.wifi.networks.find(
      network => network.ssid === this.wifiGroup,
    );
    return network;
  }

  async refreshWifi() {
    this.wifi.scanning = true;
    const [scan, current] = await Promise.all([
      getWifiScan(),
      getCurrentConnection(),
    ]);

    const ssids = new Set();

    const filteredScan = scan.filter(network => {
      if (!ssids.has(network.ssid)) {
        ssids.add(network.ssid);
        return true;
      }
    });

    this.wifi.scanning = false;
    this.wifi.networks = filteredScan;

    if (current) {
      this.wifiGroup = current.ssid;
    }
  }

  cancelWifi() {
    this.wifiGroup = this.oldWifiGroup;
    this.connectWifi.open = false;
  }
}
</script>

<style scoped>
.progress-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 128px;
}
</style>
