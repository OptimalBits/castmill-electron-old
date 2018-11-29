<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog.open" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Are you sure you want to Unregister this player?</v-card-title>
        <v-card-text>
            If you unregister this player there is no way to get it back other than
            registering from scratch.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="dialog.open = false">Cancel</v-btn>
          <v-btn color="green darken-1" flat @click="unregister">Unregister</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Frame } from "@/services/frame";

@Component({ name: "warning" })
export default class Warning extends Vue {
  @Prop()
  private dialog = {
    open: false
  };

  @Prop()
  private frame!: Frame;

  unregister() {
    this.frame.unregister();
    this.dialog.open = false;
  }
}
</script>
