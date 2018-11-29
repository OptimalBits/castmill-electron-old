export const getDeviceId = async function() {
  const crypto = require("crypto");

  const macAddress = await getMac();

  const shasum = crypto.createHash("sha1");
  shasum.update(macAddress);
  return shasum.digest("hex");
};

function getMac(): Promise<string> {
  return new Promise((resolve, reject) => {
    require("electron")
      .remote.require("getmac")
      .getMac({}, (err: Error, macAddress: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(macAddress);
        }
      });
  });
}
