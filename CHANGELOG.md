# [2.2.0](https://github.com/Krutoy242/mc-benchmark/compare/v2.1.0...v2.2.0) (2026-04-28)


### Bug Fixes

* 🐛 add guards for NaN and negative numbers in secondsToMinutes ([317aef8](https://github.com/Krutoy242/mc-benchmark/commit/317aef880998eef7709bb351a9307df77a32cb2b))
* 🐛 handle missing debug log timestamps ([b64dc0c](https://github.com/Krutoy242/mc-benchmark/commit/b64dc0c6a1c06c99fb2adeb2b467480ce3090cf9))
* 🐛 handle unrecognized forge steps ([ddaf464](https://github.com/Krutoy242/mc-benchmark/commit/ddaf464abc8c7f1f9c1fe78412e13f9ee23fe7a3))
* 🐛 prevent divide-by-zero in mod average calculation ([34cddea](https://github.com/Krutoy242/mc-benchmark/commit/34cddea9d5d63f37effefaa0d5de3a1fd561087d))
* 🐛 remove redundant local columnSumm ([6114641](https://github.com/Krutoy242/mc-benchmark/commit/61146410ad4f71ee1585d7743106df89ca0ba2ad))
* 🐛 resolve NaN in logger progress ([4df0dde](https://github.com/Krutoy242/mc-benchmark/commit/4df0dde83ab42f0ab0ceaf4083317b94d8c7dc8b))
* 🐛 resolve zero length mod array checks ([132c4cc](https://github.com/Krutoy242/mc-benchmark/commit/132c4cc81f96e72c8f3c114f5799d9a6ff9ebed7))
* **cli:** 🔧 redirect consola to stderr and handle fancy mode ([7b81784](https://github.com/Krutoy242/mc-benchmark/commit/7b81784b5f264d32ed1d5ddf982fb5bc68f98d5e))


### Features

* **cli:** 🚀 replace yargs with citty for elegant CLI building ([d1b4f6c](https://github.com/Krutoy242/mc-benchmark/commit/d1b4f6cfd08b0ece1e786ab0d62c1e4ef2a25ab7))
* parse VintageFix model bake times and group minor pie slices ([127c559](https://github.com/Krutoy242/mc-benchmark/commit/127c55953bbe78b3163c2ceb7d7b513f78458256))


### Performance Improvements

* ⚡ avoid redundant split('\n') calls on large logs ([a006589](https://github.com/Krutoy242/mc-benchmark/commit/a0065891d55b90b20868f0e6622c3db63292581e))
