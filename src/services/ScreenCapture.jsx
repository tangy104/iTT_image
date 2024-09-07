import {NativeModules} from 'react-native';

const {ScreenCapture} = NativeModules;

export const startCapture = () => {
  console.log('Starting capture...');
  return ScreenCapture.startCapture();
};

export const captureScreen = quality => {
  console.log('Capturing screen with quality:', quality);
  return ScreenCapture.captureScreen(quality);
};

export const stopCapture = () => {
  console.log('Stopping capture...');
  return ScreenCapture.stopCapture();
};
