module.exports = {
  transport: {
    module: 'local',
    remoteUrl: 'https://castmill.io/updates',
    outPath: 'dist_electron/publish',
  },
  // If you've already set package.json:updater.url you can skip this option:
  updatesJsonUrl: 'https://castmill.io/updates/updates.json',
  // updatesJsonUrl: 'http://10.0.0.44:4455/updates.json',
};
