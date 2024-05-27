import React, {useEffect} from 'react';
import {View, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useDispatch, useSelector} from 'react-redux';
import {
  connectWebSocket,
  startScreenCapture,
  stopScreenCapture,
} from './state/screenSharingSlice';

import Home from '../src/screens/home/Home';
import Login from '../src/screens/login/Login';
import ScanVIN from '../src/screens/scanVIN/ScanVIN';
import VinCamera from '../src/screens/camera/VinCamera';
import NewSmodel from '../src/screens/smodel/NewSModel';
import CameraScreen from '../src/screens/camera/CameraScreen';
import AboutApp from '../src/screens/about/AboutApp';
import AboutCoEAMT from '../src/screens/about/AboutCoEAMT';
import Profile from '../src/screens/user/Profile';
import AdminScreen from '../src/screens/admin/AdminScreen';
import Amodel from '../src/screens/amodel/Amodel';
import Dashboard from '../src/screens/dashboard/Dashboard';
import CameraScreenNew1 from '../src/screens/camera/CameraScreenNew1/CameraScreenNew1';
import CameraScreen2 from '../src/screens/camera/CameraScreen2';
import ScreenSharing from '../src/screens/screenSharing/ScreenSharing';

const MainHome = () => {
  const Stack = createNativeStackNavigator();

  const dispatch = useDispatch();
  const {isCapturing, isConnected} = useSelector(state => state.screenSharing);

  // useEffect(() => {
  //   dispatch(connectWebSocket());

  //   return () => {
  //     dispatch(stopScreenCapture());
  //   };
  // }, [dispatch]);

  const handleStartCapture = () => {
    dispatch(startScreenCapture());
  };

  const handleStopCapture = () => {
    dispatch(stopScreenCapture());
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ScanVIN" component={ScanVIN} />
        <Stack.Screen name="VinCamera" component={VinCamera} />
        <Stack.Screen name="NewSmodel" component={NewSmodel} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="AboutApp" component={AboutApp} />
        <Stack.Screen name="AboutCoEAMT" component={AboutCoEAMT} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="Amodel" component={Amodel} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="CameraScreenNew1" component={CameraScreenNew1} />
        <Stack.Screen name="CameraScreen2" component={CameraScreen2} />
        <Stack.Screen name="ScreenSharing" component={ScreenSharing} />
      </Stack.Navigator>
      {/* <View
        style={{
          height: 50,
          width: 100,
          position: 'absolute',
          right: 20,
          top: 20,
        }}>
        <Button
          title={isCapturing ? 'Stop Mirroring' : 'Start Mirroring'}
          onPress={isCapturing ? handleStopCapture : handleStartCapture}
          disabled={!isConnected}
        />
      </View> */}
    </NavigationContainer>
  );
};

export default MainHome;
