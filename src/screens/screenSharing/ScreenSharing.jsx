// import React, {useEffect, useRef, useState} from 'react';
// import {View, Button, Alert, Text, TextInput} from 'react-native';
// import {captureScreen} from 'react-native-view-shot';

// const ScreenSharing = () => {
//   const ws = useRef(null);
//   const intervalRef = useRef(null);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     ws.current = new WebSocket('ws://192.168.255.171:8080');

//     ws.current.onopen = () => {
//       console.log('WebSocket connection opened');
//       setIsConnected(true);
//     };

//     ws.current.onclose = e => {
//       console.log('WebSocket connection closed', e);
//       setIsConnected(false);
//       stopScreenCapture();
//     };

//     ws.current.onerror = e => {
//       console.error('WebSocket error', e);
//       Alert.alert('WebSocket Error', 'Please check your network connection.');
//       setIsConnected(false);
//       stopScreenCapture();
//     };

//     return () => {
//       ws.current.close();
//       stopScreenCapture();
//     };
//   }, []);

//   const startScreenCapture = () => {
//     if (!intervalRef.current && isConnected) {
//       intervalRef.current = setInterval(sendScreenshot, 1000 / 5); // Capture 10 frames per second
//       setIsCapturing(true);
//     }
//   };

//   const stopScreenCapture = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//       setIsCapturing(false);
//     }
//   };

//   const sendScreenshot = () => {
//     captureScreen({
//       format: 'jpg',
//       quality: 0.5,
//     })
//       .then(uri => {
//         fetch(uri)
//           .then(response => response.blob())
//           .then(blob => {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//               //   const base64Data = reader.result.split(',')[1]; // Extract base64 data part
//               console.log('app.js', reader.result);
//               if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//                 ws.current.send(reader.result); // Send only the base64 data
//               }
//             };
//             reader.readAsDataURL(blob);
//           });
//       })
//       .catch(error => console.error('Error capturing screen:', error));
//   };

//   return (
//     <View>
//       <Button
//         title={isCapturing ? 'Stop Screen Capture' : 'Start Screen Capture'}
//         onPress={isCapturing ? stopScreenCapture : startScreenCapture}
//         disabled={!isConnected}
//       />
//       <View
//         style={{
//           backgroundColor: 'blue',
//           width: 100,
//           height: 50,
//           justifyContent: 'center',
//         }}>
//         <Text>Enter you text:</Text>
//       </View>
//       <TextInput
//         placeholder="share your screen here"
//         placeholderTextColor="black"
//         style={{color: 'red', borderColor: 'black', borderWidth: 1}}
//       />
//     </View>
//   );
// };

// export default ScreenSharing;

// ScreenSharingComponent.js

import React, {useEffect} from 'react';
import {View, Button, Text, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  connectWebSocket,
  startScreenCapture,
  stopScreenCapture,
} from '../../state/screenSharingSlice';

const ScreenSharingComponent = () => {
  const dispatch = useDispatch();
  const {isCapturing, isConnected} = useSelector(state => state.screenSharing);

  useEffect(() => {
    dispatch(connectWebSocket());

    return () => {
      dispatch(stopScreenCapture());
    };
  }, [dispatch]);

  return (
    <View>
      <Button
        title={isCapturing ? 'Stop Screen Capture' : 'Start Screen Capture'}
        onPress={
          isCapturing
            ? () => dispatch(stopScreenCapture())
            : () => dispatch(startScreenCapture())
        }
        disabled={!isConnected}
      />
      <View
        style={{
          backgroundColor: 'blue',
          width: 100,
          height: 50,
          justifyContent: 'center',
        }}>
        <Text>Enter your text:</Text>
      </View>
      <TextInput
        placeholder="Share your screen here"
        placeholderTextColor="black"
        style={{color: 'red', borderColor: 'black', borderWidth: 1}}
      />
    </View>
  );
};

export default ScreenSharingComponent;
