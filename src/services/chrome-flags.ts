import { app } from "electron";

export class ChromeFlags {
  flags: {
      [index: string]: string
  };

  constructor() {
    console.log("GPU Features", app.getGPUFeatureStatus());
    this.flags = require("../../flags.json");
  }

  setup() {
    for (const flag in this.flags) {
      app.commandLine.appendSwitch(flag, this.flags[flag]);
    }
  }
}
