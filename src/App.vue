<template>
  <v-app>
    <iframe id="frame" width="100%" height="100%" src="https://player.castmill.com"></iframe>
    <settings></settings>
  </v-app>

</template>

<script>
import settings from './components/settings';

export default {
  name: 'App',
  components: {
    settings
  },
  data () {
    return {
      //
    };
  }
};
</script>
