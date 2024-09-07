import React, {useState, useEffect} from 'react';
import {View, Button, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  connectWebSocket,
  startScreenCapture,
  stopScreenCapture,
} from './state/screenSharingSlice';

import LogInHome from '../src/screens/home/LogInHome';
import StackHome from '../src/screens/home/StackHome';
import Login from '../src/screens/login/Login';
import ScanVIN from '../src/screens/scanVIN/ScanVIN';
import VinCamera from '../src/screens/camera/VinCamera';
import NewSmodel from '../src/screens/smodel/NewSModel';
import CameraScreenImg from '../src/screens/camera/CameraScreenImg';
import AboutApp from '../src/screens/about/AboutApp';
import AboutCoEAMT from '../src/screens/about/AboutCoEAMT';
import Profile from '../src/screens/user/Profile';
import AdminScreen from '../src/screens/admin/AdminScreen';
import Amodel from '../src/screens/amodel/Amodel';
import Dashboard from '../src/screens/dashboard/Dashboard';
import CameraScreenNew1 from '../src/screens/camera/CameraScreenNew1/CameraScreenNew1';
import CameraScreen2 from '../src/screens/camera/CameraScreen2';
import ScreenSharing from '../src/screens/screenSharing/ScreenSharing';

const LoginNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="LogInHome"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="LogInHome" component={LogInHome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AdminScreen" component={AdminScreen} />
      <Stack.Screen name="StackNav" component={StackNav} />
    </Stack.Navigator>
  );
};

const StackNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="StackHome"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="StackHome" component={StackHome} />
      <Stack.Screen name="ScanVIN" component={ScanVIN} />
      <Stack.Screen name="VinCamera" component={VinCamera} />
      <Stack.Screen name="NewSmodel" component={NewSmodel} />
      <Stack.Screen name="CameraScreen" component={CameraScreenImg} />
      <Stack.Screen name="AboutApp" component={AboutApp} />
      <Stack.Screen name="AboutCoEAMT" component={AboutCoEAMT} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="AdminScreen" component={AdminScreen} />
      <Stack.Screen name="Amodel" component={Amodel} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="CameraScreenNew1" component={CameraScreenNew1} />
      <Stack.Screen name="CameraScreen2" component={CameraScreen2} />
      <Stack.Screen name="ScreenSharing" component={ScreenSharing} />
      <Stack.Screen name="LoginNav" component={LoginNav} />
    </Stack.Navigator>
  );
};

const MainHome = () => {
  const RootStack = createNativeStackNavigator();

  const dispatch = useDispatch();
  const {isCapturing, isConnected} = useSelector(state => state.screenSharing);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await DeviceInfo.getAndroidId();
      setDeviceId(id);
      console.log('deviceId=', deviceId);
    };

    fetchDeviceId();
  }, []);

  // useEffect(() => {
  //   dispatch(connectWebSocket());
  //   handleStartCapture();

  //   return () => {
  //     dispatch(stopScreenCapture());
  //   };
  // }, [dispatch]);

  //ce52f8bf60f2db5f
  //3f879629b94e3dc0
  //04dfb65d0da8d600

  const handleStartCapture = () => {
    if (deviceId === 'f80b60565be51cba') {
      dispatch(startScreenCapture('device1', '123456'));
    } else {
      dispatch(startScreenCapture('device2', '789456'));
    }
  };

  const handleStopCapture = () => {
    dispatch(stopScreenCapture());
  };

  const checkLogin = async () => {
    const data = await AsyncStorage.getItem('isLoggedIn');
    console.log('at main home', data);
    setIsLoggedIn(data === 'true');
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <NavigationContainer
      onReady={() => {
        SplashScreen.hide();
      }}>
      {isLoggedIn ? <StackNav /> : <LoginNav />}

      {/* <View
        style={{
          height: 50,
          width: 100,
          position: 'absolute',
          right: 20,
          top: 20,
        }}>
        <Text>{deviceId}</Text>
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
