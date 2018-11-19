<template>
   <v-dialog v-model="dialog" scrollable max-width="400px">
      <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
      <v-card>
        <v-card-title>Player Info</v-card-title>

        <div>Online: YES</div>

        <v-divider></v-divider>

        <v-card-text style="height: 500px;">
          <v-list subheader two-line>
            <v-subheader>Player Settings</v-subheader>

            <v-list-tile @click="">
              <v-list-tile-action>
                <v-checkbox v-model="autostart"></v-checkbox>
              </v-list-tile-action>

              <v-list-tile-content @click="autostart = !autostart">
                <v-list-tile-title>Autostart</v-list-tile-title>
                <v-list-tile-sub-title>Player will autostart on next reboot</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="">
              <v-list-tile-action>
                <v-checkbox v-model="debug"></v-checkbox>
              </v-list-tile-action>

              <v-list-tile-content @click="debug = !debug">
                <v-list-tile-title>Togle debug window</v-list-tile-title>
                <v-list-tile-sub-title>Show the debug window with useful player information</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>

            <v-subheader>Actions</v-subheader>

            <v-list-tile @click="">
              <v-list-tile-content @click="">
                <v-list-tile-title>Restart</v-list-tile-title>
                <v-list-tile-sub-title>Restarts the player</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="">
              <v-list-tile-content @click="">
                <v-list-tile-title>Quit</v-list-tile-title>
                <v-list-tile-sub-title>Exits the playern</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  <div class="menu">
    <div class="info">
      <h3>Info</h3>
     <div>Version: {{version}}</div>
     <div>Name: {{playerName}}</div>
     <div>Connection: </div>
     <div>Network: {{navigator.onLine}}</div>
    </div>

    <div class="actions">

  alacarte.setHeader(service)
    .addCheckbox('Autostart', autostart, function(state){
      if(state){
        return nssm.set(service, 'Start', 'SERVICE_AUTO_START').then(function(){
          console.log("Autostart enabled")
        });
      }else{
        return nssm.set(service, 'Start', 'SERVICE_DEMAND_START').then(function(){
          console.log("Autostart disabled")
        });
      }
    }).addItem('Resume', function(){
      alacarte.hide();
    }).addItem('Restart', function(){
      window && window.location.reload();
    }).addItem('Toggle Debug', function(){
      iframe && iframe.contentWindow.postMessage('console', '*');
    }).addItem('Quit', function(){
      nssm.stop(service).finally(function(){
        gui.App.quit();
      })
    }).addItem('Un-register (Caution!)', function(){
      iframe && iframe.contentWindow.postMessage('delete', '*');
      // Send a postmessage to the player iframe telling him to unregister this player.
    });

    -->
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Menu extends Vue {
  @Prop()
  private msg!: string;

  version = "1.0.0";
  playerName = "Castmill";
  navigator = window.navigator;

  autostart = false;
  debug = false;
  dialogm1 = "";
  dialog = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.menu {
  display: block;
  position: absolute;
  z-index: 999;
  background: #333;
  color: #ccc;
}
</style>
