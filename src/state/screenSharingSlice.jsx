// import {createSlice} from '@reduxjs/toolkit';
// import WebSocketService from '../services/webSocketService';
// import {captureScreen} from 'react-native-view-shot';
// import {Alert} from 'react-native';

// const initialState = {
//   isCapturing: false,
//   isConnected: false,
//   intervalId: null,
// };

// let webSocketService = null;

// export const screenSharingSlice = createSlice({
//   name: 'screenSharing',
//   initialState,
//   reducers: {
//     webSocketOpened: state => {
//       state.isConnected = true;
//     },
//     webSocketClosed: state => {
//       state.isConnected = false;
//       state.isCapturing = false;
//       if (state.intervalId) {
//         clearInterval(state.intervalId);
//         state.intervalId = null;
//       }
//     },
//     webSocketError: state => {
//       state.isConnected = false;
//       state.isCapturing = false;
//       if (state.intervalId) {
//         clearInterval(state.intervalId);
//         state.intervalId = null;
//       }
//       Alert.alert('WebSocket Error', 'Please check your network connection.');
//     },
//     startCapture: (state, action) => {
//       state.isCapturing = true;
//       state.intervalId = action.payload;
//     },
//     stopCapture: state => {
//       state.isCapturing = false;
//       if (state.intervalId) {
//         clearInterval(state.intervalId);
//         state.intervalId = null;
//       }
//     },
//   },
// });

// export const {
//   webSocketOpened,
//   webSocketClosed,
//   webSocketError,
//   startCapture,
//   stopCapture,
// } = screenSharingSlice.actions;

// export const connectWebSocket = () => dispatch => {
//   webSocketService = new WebSocketService('ws://192.168.19.171:8080');

//   webSocketService.connect(
//     () => dispatch(webSocketOpened()),
//     () => dispatch(webSocketClosed()),
//     () => dispatch(webSocketError()),
//   );
// };

// export const startScreenCapture =
//   (deviceId, currentUserID) => (dispatch, getState) => {
//     const {isConnected} = getState().screenSharing;
//     if (isConnected && webSocketService) {
//       const intervalId = setInterval(() => {
//         captureScreen({
//           format: 'jpg',
//           quality: 0.5,
//         })
//           .then(uri => {
//             fetch(uri)
//               .then(response => response.blob())
//               .then(blob => {
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                   webSocketService.send(
//                     JSON.stringify({
//                       deviceId,
//                       currentUserID,
//                       image: reader.result,
//                     }),
//                   );
//                   console.log('image from native:', reader.result);
//                   URL.revokeObjectURL(uri); // Free up memory
//                 };
//                 reader.readAsDataURL(blob);
//               });
//           })
//           .catch(error => console.error('Error capturing screen:', error));
//       }, 1000 / 1);
//       dispatch(startCapture(intervalId));
//     }
//   };

// export const stopScreenCapture = () => (dispatch, getState) => {
//   const {intervalId} = getState().screenSharing;
//   if (intervalId) {
//     clearInterval(intervalId);
//     dispatch(stopCapture());
//   }
// };

// export default screenSharingSlice.reducer;

// screenSharingSlice.js
import {Alert} from 'react-native';
import {createSlice} from '@reduxjs/toolkit';
import WebSocketService from '../services/webSocketService';
import {
  startCapture as startNativeCapture,
  captureScreen,
  stopCapture as stopNativeCapture,
} from '../services/ScreenCapture';
// import {useDispatch, useSelector} from 'react-redux';

const initialState = {
  isCapturing: false,
  isConnected: false,
  intervalId: null,
};

let webSocketService = null;

export const screenSharingSlice = createSlice({
  name: 'screenSharing',
  initialState,
  reducers: {
    webSocketOpened: state => {
      state.isConnected = true;
    },
    webSocketClosed: state => {
      state.isConnected = false;
      state.isCapturing = false;
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
      }
    },
    webSocketError: state => {
      state.isConnected = false;
      state.isCapturing = false;
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
      }
      Alert.alert('WebSocket Error', 'Please check your network connection.');
    },
    beginCapture: (state, action) => {
      state.isCapturing = true;
      state.intervalId = action.payload;
    },
    stopCapture: state => {
      state.isCapturing = false;
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
      }
    },
  },
});

export const {
  webSocketOpened,
  webSocketClosed,
  webSocketError,
  beginCapture,
  stopCapture,
} = screenSharingSlice.actions;

export const connectWebSocket = url => dispatch => {
  // webSocketService = new WebSocketService('ws://192.168.19.171:8080');
  // const creden = useSelector(state => state.creden.creden);
  console.log('ws_uri-', url);
  webSocketService = new WebSocketService(
    // 'ws://192.168.113.171:1338/ws_scr_mirror',
    url + '/ws_scr_mirror',
  );

  webSocketService.connect(
    () => dispatch(webSocketOpened()),
    () => dispatch(webSocketClosed()),
    () => dispatch(webSocketError()),
  );
};

export const startScreenCapture =
  (deviceId, currentUserID, quality = 50) =>
  (dispatch, getState) => {
    const {isConnected} = getState().screenSharing;
    if (isConnected && webSocketService) {
      startNativeCapture();
      const intervalId = setInterval(() => {
        captureScreen(quality)
          .then(base64Image => {
            webSocketService.send(
              JSON.stringify({
                deviceId,
                currentUserID,
                image: base64Image,
              }),
            );
            // console.log('image from native:', base64Image);
          })

          .catch(error => console.error('Error capturing screen:', error));
      }, 1000 / 1);
      dispatch(beginCapture(intervalId));
    }
  };

export const stopScreenCapture = () => (dispatch, getState) => {
  const {intervalId} = getState().screenSharing;
  if (intervalId) {
    clearInterval(intervalId);
    stopNativeCapture();
    dispatch(stopCapture());
  }
};

export default screenSharingSlice.reducer;
