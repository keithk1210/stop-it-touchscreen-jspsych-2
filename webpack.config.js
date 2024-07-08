const path = require('path');

module.exports = {
    entry: {
        webgazer: './resources/webpack---webgazer/src/index.mjs',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            // Configure aliases for different versions or specific paths of TensorFlow
            // '@tensorflow/tfjs': path.resolve(__dirname, './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-core/dist/tensor.js'
            // '@tensorflow/tfjs-core': path.resolve(__dirname, './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-core/dist/tensor.js'
            // '@tensorflow-models/face-landmarks-detection': path.resolve(__dirname, './resources/webpack---webgazer/node_modules/@tensorflow-models/face-landmarks-detection/dist/face-landmarks-detection.esm.js'
            // 'regression': path.resolve(__dirname, './resources/webpack---webgazer/node_modules/regression/dist/regression.js'
            // 'localforage': path.resolve(__dirname, './resources/webpack---webgazer/node_modules/localforage/dist/localforage.js'
            // '@tensorflow/tfjs-converter': path.resolve(__dirname, './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-converter/dist/flags.js'
            '@tensorflow/tfjs':  './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-core',
            '@tensorflow/tfjs-backend-cpu':  './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-backend-cpu',
            '@tensorflow/tfjs-backend-webgl':  './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-backend-webgl',
            '@tensorflow/tfjs-converter':  './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-converter',
            '@tensorflow/tfjs-core':  './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-core',
            '@tensorflow/tfjs-data':  './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-data',
            '@tensorflow/tfjs-layers':  './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-layers',
            '@tensorflow':  './resources/webpack---webgazer/node_modules/@tensorflow/tfjs-core',
            '@tensorflow-models/face-landmarks-detection':  './resources/webpack---webgazer/node_modules/@tensorflow-models/face-landmarks-detection',
            'localforage':  './resources/webpack---webgazer/node_modules/localforage',
            'long':  './resources/webpack---webgazer/node_modules/long',
            'regression':  './resources/webpack---webgazer/node_modules/regression',
            'seedrandom':  './resources/webpack---webgazer/node_modules/seedrandom'
            

        }
    },
    // Add plugins and optimization settings as needed
};
