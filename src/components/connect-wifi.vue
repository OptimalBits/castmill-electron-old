<template>
  <v-layout v-if="network" row justify-center>
    <v-dialog v-model="dialog.open" persistent max-width="290">
      <v-form ref="form">
        <v-card>
          <v-card-title class="headline">Connect to {{network.ssid}} ({{network.security}})</v-card-title>
          <v-card-text v-if="!connecting && !connectionError">
            <v-text-field
              v-if="network.security"
              v-model="password"
              :append-icon="show ? 'visibility_off' : 'visibility'"
              :rules="[rules.required]"
              :type="show ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              counter
              @click:append="show = !show"
            ></v-text-field>
          </v-card-text>
          <div v-if="connecting" class="progress-wrapper">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-if="connectionError">
            {{ connectionError }}
            <v-btn color="green darken-1" flat @click="connectionError = ''">OK</v-btn>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="connecting || !!connectionError"
              color="green darken-1"
              flat
              @click="cancel()"
            >Cancel</v-btn>
            <v-btn
              :disabled="!password || connecting || !!connectionError"
              color="green darken-1"
              flat
              @click="connect"
            >Connect</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { connect } from '@/render-services/wifi';
import { Network } from '@/interfaces/network';

@Component({ name: 'connect-wifi' })
export default class ConnectWifi extends Vue {
  @Prop()
  private dialog!: {
    open: false;
  };

  @Prop()
  private network!: Network;

  connectionError = '';
  connecting = false;
  show = false;
  password = '';

  rules = {
    required: (value: string) => !!value || 'Required.',
  };

  async connect() {
    this.connecting = true;
    this.connectionError = await connect({
      ssid: this.network.ssid,
      password: this.password,
    });

    this.connecting = false;

    if (!this.connectionError) {
      this.dialog.open = false;
    }
  }

  cancel() {
    this.$emit('cancel');
  }

  @Watch('dialog.open')
  resetPassword() {
    this.password = '';

    const form = this.$refs.form as HTMLFormElement;
    form.reset();
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
