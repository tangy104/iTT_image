import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  PermissionsAndroid,
  StyleSheet,
  Text,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {setTinGlobal} from '../../state/tinslice';
import {setCreden} from '../../state/credenSlice';
import {active, inactive} from '../../state/alertSlice';
import {ApiVideoLiveStreamView} from '@api.video/react-native-livestream';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

import TopTabs from '../../navigation/TopTabs';
import Tabs from '../../navigation/Tabs';

import logoApp from '../../utils/images/logoApp.png';
import ham from '../../utils/images/ham.png';
import question from '../../utils/images/question.png';
import dash from '../../utils/images/dash.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import logout from '../../utils/images/logout.png';
import chassis from '../../utils/images/chassis.jpg';

import {URI} from '@env';

const CameraScreen = ({navigation, route}) => {
  const ref = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [gotResponse, setGotResponse] = useState(false);

  const [imageUri, setImageUri] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [base64, setBase64] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);

  const dispatch = useDispatch();
  const alert = useSelector(state => state.alert.value);
  const selectedWheelData = useSelector(
    state => state.app.selectedWheelDataGlobal,
  );

  const globalToken = useSelector(state => state.token.tokenGlobal);
  const creden = useSelector(state => state.creden.creden);

  // For testing
  // const requestCameraPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       {
  //         title: 'Cool Photo App Camera Permission',
  //         message:
  //           'Cool Photo App needs access to your camera ' +
  //           'so you can take awesome pictures.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('You can use the camera');
  //     } else {
  //       console.log('Camera permission denied');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  const updateData = async () => {
    try {
      const response = await axios.put(`${creden.URI}/car_wvid/`, null, {
        params: {
          stream_key: `${creden.ticket}`,
          id: route.params.id,
          vin: route.params.vin,
          axle_location: selectedWheelData.axle_location,
          wheel_pos: selectedWheelData.wheel_pos,
          wheel_id: selectedWheelData.wheel_id,
          token: globalToken,
        },
        headers: {
          Accept: 'application/json',
        },
        responseType: 'arraybuffer',
      });
      ref.current?.stopStreaming();
      setStreaming(false);
      // Verify the base64 data
      const base64Image = response.request._response;
      // console.log('Base64 image data:', base64Image);
      console.log('response headers', response.headers);

      // Set the image URI to display the image
      const imageUrl = `data:image/jpg;base64,${base64Image}`;
      // console.log('imageURL', imageUrl);
      setImageUri(imageUrl);
      console.log('setImage', imageUri);
      setBase64(base64Image);
      setHeaders(response.headers);
      setGotResponse(true);
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
    }
  };
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Do you really want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              const response = await axios.post(
                `${creden.URI + '/logout'}?token=${globalToken}`,
              );
              dispatch(
                setCreden({
                  ticket: null,
                  URI: creden.URI,
                  WS_URI: creden.WS_URI,
                  RTMP_URI: creden.RTMP_URI,
                }),
              );
              console.log('Logout successful', response.data);
              navigation.navigate('Login');
            } catch (error) {
              console.error('Error logging out', error);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: 'black'}}>
      <TopTabs
        left={ham}
        center={logoApp}
        right={question}
        tabLeftFunc={() => navigation.navigate('Profile')}
        tabRightFunc={() => navigation.navigate('AboutApp')}
      />
      {gotResponse ? (
        <View style={{backgroundColor: 'black', flex: 1, width: '100%'}}>
          {imgLoading && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          {imageUri && (
            <Image
              source={{
                uri: imageUri,
              }}
              // source={chassis}
              style={{
                // width: '100%',
                height: '100%',
                marginBottom: 20,
                resizeMode: 'cover',
              }}
              onLoadStart={() => setImgLoading(true)}
              onLoad={() => setImgLoading(false)}
              onLoadEnd={() => setImgLoading(false)}
            />
          )}
          {headers && (
            <View
              style={{
                top: '72%',
                alignSelf: 'center',
                position: 'absolute',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: 15,
                borderRadius: 10,
                elevation: 5,
                justifyContent: 'center',
                alignItems: 'center',
                width: '65%',
                minHeight: 50,
                height: '20%',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  // marginBottom: 10,
                  color: 'black',
                }}>
                Extracted Data
              </Text>

              <View
                style={{
                  margin: 2,
                  // marginTop: 15,
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  width: 220,
                  // height: 40,
                  // top: 160,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: '#3758ff',
                  //   justifyContent: "center",
                  // alignItems: 'center',
                  //   zIndex: 2,
                  //   backgroundColor: "red",
                  padding: 5,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>
                  TIN: {headers['output']}
                </Text>
                <Text style={{color: 'black', fontWeight: 'bold'}}>
                  Make: {headers['make']}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  width: 190,
                  height: 40,
                  // top: 160,
                  borderRadius: 12,
                  // borderWidth: 3,
                  // borderColor: "#3758ff",
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2,
                  backgroundColor: '#3758ff',
                  marginTop: 5,
                }}
                onPress={() => {
                  dispatch(setTinGlobal(headers['output']));
                  navigation.navigate('NewSmodel', {
                    model: route.params.model,
                    responseData: headers['output'],
                    id: route.params.id,
                    // elapsedTime: alertTime,
                  });
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 17,
                    letterSpacing: 1,
                  }}>
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignSelf: 'stretch',
            // justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ApiVideoLiveStreamView
            style={{flex: 1, backgroundColor: 'black', alignSelf: 'stretch'}}
            ref={ref}
            camera="back"
            enablePinchedZoom={true}
            video={{
              fps: 30,
              resolution: '720p',
              bitrate: 2 * 1024 * 1024, // # 2 Mbps
              gopDuration: 1, // 1 second
            }}
            audio={{
              bitrate: 128000,
              sampleRate: 44100,
              isStereo: true,
            }}
            isMuted={false}
            onConnectionSuccess={() => {
              //do what you want
              console.log('Connection success');
            }}
            onConnectionFailed={e => {
              //do what you want
              console.log('Connection failed', e);
            }}
            onDisconnect={() => {
              //do what you want
              console.log('Disconnected');
            }}
          />
          <View style={{position: 'absolute', bottom: 60}}>
            <TouchableOpacity
              style={{
                // borderRadius: 50,
                backgroundColor: streaming ? 'red' : 'white',
                width: 220,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#3758ff',
                // alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
              }}
              onPress={() => {
                if (streaming) {
                  ref.current?.stopStreaming();
                  setStreaming(false);
                } else {
                  ref.current?.startStreaming(
                    `${creden.ticket}`,
                    creden.RTMP_URI,
                  );
                  setStreaming(true);
                  updateData();
                }
                // requestCameraPermission();
              }}>
              <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
                {streaming ? 'Scanning' : 'Scan'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Tabs
        left={dash}
        center={logoKGP2}
        right={logout}
        tabLeftFunc={() => navigation.navigate('Dashboard')}
        tabRightFunc={handleLogout}
      />
    </View>
  );
};

export default CameraScreen;
