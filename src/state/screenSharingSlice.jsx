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
//   webSocketService = new WebSocketService('ws://192.168.27.171:8080');

//   webSocketService.connect(
//     () => dispatch(webSocketOpened()),
//     () => dispatch(webSocketClosed()),
//     () => dispatch(webSocketError()),
//   );
// };

// export const startScreenCapture = deviceId => (dispatch, getState) => {
//   const {isConnected} = getState().screenSharing;
//   if (isConnected && webSocketService) {
//     const intervalId = setInterval(() => {
//       captureScreen({
//         format: 'jpg',
//         quality: 0.5,
//       })
//         .then(uri => {
//           fetch(uri)
//             .then(response => response.blob())
//             .then(blob => {
//               const reader = new FileReader();
//               reader.onloadend = () => {
//                 webSocketService.send(
//                   JSON.stringify({deviceId, image: reader.result}),
//                 );
//                 URL.revokeObjectURL(uri); // Free up memory
//               };
//               reader.readAsDataURL(blob);
//             });
//         })
//         .catch(error => console.error('Error capturing screen:', error));
//     }, 1000 / 1);
//     dispatch(startCapture(intervalId));
//   }
// };

// export const stopScreenCapture = () => (dispatch, getState) => {
//   const {intervalId} = getState().screenSharing;
//   if (intervalId) {
//     clearInterval(intervalId);
//     dispatch(stopCapture());
//   }
// };

// export default screenSharingSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';
import WebSocketService from '../services/webSocketService';
import {captureScreen} from 'react-native-view-shot';
import {Alert} from 'react-native';

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
    startCapture: (state, action) => {
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
  startCapture,
  stopCapture,
} = screenSharingSlice.actions;

export const connectWebSocket = () => dispatch => {
  webSocketService = new WebSocketService('ws://192.168.157.171:8080');

  webSocketService.connect(
    () => dispatch(webSocketOpened()),
    () => dispatch(webSocketClosed()),
    () => dispatch(webSocketError()),
  );
};

export const startScreenCapture =
  (deviceId, currentUserID) => (dispatch, getState) => {
    const {isConnected} = getState().screenSharing;
    if (isConnected && webSocketService) {
      const intervalId = setInterval(() => {
        captureScreen({
          format: 'jpg',
          quality: 0.5,
        })
          .then(uri => {
            fetch(uri)
              .then(response => response.blob())
              .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  webSocketService.send(
                    JSON.stringify({
                      deviceId,
                      currentUserID,
                      image: reader.result,
                    }),
                  );
                  URL.revokeObjectURL(uri); // Free up memory
                };
                reader.readAsDataURL(blob);
              });
          })
          .catch(error => console.error('Error capturing screen:', error));
      }, 1000 / 1);
      dispatch(startCapture(intervalId));
    }
  };

export const stopScreenCapture = () => (dispatch, getState) => {
  const {intervalId} = getState().screenSharing;
  if (intervalId) {
    clearInterval(intervalId);
    dispatch(stopCapture());
  }
};

export default screenSharingSlice.reducer;
