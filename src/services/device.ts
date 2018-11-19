export const getDeviceId = function() {
  return new Promise(function(resolve, reject) {
    const crypto = require("crypto");
    require("getmac").getMac(function(err: Error, macAddress: string) {
      if (err) {
        return reject(err);
      }

      const shasum = crypto.createHash("sha1");
      shasum.update(macAddress);
      resolve(shasum.digest("hex"));
    });
  });
};
