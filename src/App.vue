<template>
  <v-app>
    <div id="eventsurface" :style="style" @mousemove="showCursor" @click="openSettings"></div>
    <div id="player" ref="player"></div>
    <settings :frame="frame" :dialog="settings"></settings>
  </v-app>

</template>

<script>
import Settings from "@/components/settings";
import { Frame } from "@/render-services/frame";

const HIDE_CURSOR_TIMEOUT = 5 * 1000;

export default {
  name: "App",
  components: {
    Settings
  },
  data() {
    return {
      settings: {
        open: false
      },
      frame: {},
      style: {
        cursor: 'inherit'
      }
    };
  },
  methods: {
    openSettings: function() {
      this.settings.open = true;
      this.showCursor();
    },
    showCursor: function() {
      this.style.cursor = 'inherit';

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.style.cursor = 'none';
      }, HIDE_CURSOR_TIMEOUT);
    }
  },

  mounted() {
    this.frame = new Frame(this.$refs.player);
    this.showCursor();
  }
};
</script>

<style scoped>
#player {
  height: 100%;
  width: 100%;
}

#eventsurface {
  background: transparent;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border: 0px;
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  z-index: 200;
}
</style>
