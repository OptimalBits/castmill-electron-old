module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.castmill.player",
        productName: "Castmill Player",
        copyright: "(c) 2011-2018 Optimal Bits Sweden AB",
        artifactName: "${name}-${version}-${arch}.${ext}", // do not change. Required for autoupdate
        appImage: {
          systemIntegration: "doNotAsk"
        },
        // options placed here will be merged with default configuration and passed to electron-builder
        linux: {
          category: "Video",
          target: [
            {
              target: "AppImage",
              arch: ["armv7l", "ia32", "x64"]
            }
          ]
        }
      }
    }
  }
};
