module.exports = {
  transport: {
    module: 's3',
    bucket: 'castmill-updates',
    pathPrefix: 'linux/',
  },
  updatesJsonUrl: 'https://update.castmill.io/linux/updates.json',
};
