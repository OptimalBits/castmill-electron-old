/**
	File cache.
*/
const request = require('request');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

export class Cache {
  constructor(private dataPath: string) {
    dataPath = path.join(__dirname, dataPath);
  }

  downloadFile(srcUrl: string, localUrl: string) {
    const dstFile = path.join(this.dataPath, localUrl);
    const srcStream = request.get(srcUrl);

    return new Promise(function(resolve, reject) {
      mkdirp(path.dirname(dstFile), function(err: Error) {
        if (err) return reject(err);

        const dstStream = fs.createWriteStream(dstFile, {
          flags: 'w',
          encoding: null,
        });

        srcStream.pipe(dstStream);

        dstStream.on('finish', function() {
          resolve(localUrl);
        });

        srcStream.on('error', function(err: Error) {
          reject(err);
        });

        dstStream.on('error', function(err: Error) {
          reject(err);
        });
      });
    });
  }
}

/*
var cache = new Cache('data');

await 
cache.downloadFile('http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', 'blabla');
console.log("Done!")
*/
