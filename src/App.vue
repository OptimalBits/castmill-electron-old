<template>
  <v-app>
    <div id="eventsurface" @click="settings.open = true"></div>
    <div id="player" ref="player"></div>
    <settings :frame="frame" :dialog="settings"></settings>
  </v-app>

</template>

<script>
import Settings from "@/components/settings";
import { Frame } from "@/services/frame";

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
      frame: {}
    };
  },

  mounted() {
    this.frame = new Frame(this.$refs.player);
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
