module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.castmill.player",
        productName: "Castmill Player",
        copyright: "(c) 2011-2018 Optimal Bits Sweden AB",
        artifactName: "${name}_${version}_${arch}.${ext}",
        appImage: {
          systemIntegration: "doNotAsk"
        },
        // options placed here will be merged with default configuration and passed to electron-builder
        linux: {
          category: "Video",
          target: [
            /*
            {
              target: "AppImage",
              arch: ["armv7l", "ia32", "x64"]
            },
            {
              target: "pacman",
              arch: ["armv7l"]
            },
            {
              target: "apk",
              arch: ["armv7l"]
            },
            */
            {
              target: 'apk',
              arch: ['armv7l'],
            },
          ],
        },
      },
    },
  },
};
