import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  Modal,
  useWindowDimensions,
} from 'react-native';
import {Switch} from 'react-native-switch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {setTinGlobal} from '../../state/tinslice';
import {setCreden} from '../../state/credenSlice';
import {active, inactive} from '../../state/alertSlice';
import {ApiVideoLiveStreamView} from '@api.video/react-native-livestream';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

import TopTabs from '../../navigation/TopTabs';
import Tabs from '../../navigation/Tabs';

import logoApp from '../../utils/images/logoApp.png';
import ham from '../../utils/images/ham.png';
import question from '../../utils/images/question.png';
import dash from '../../utils/images/dash.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import logoKGP3 from '../../utils/images/logoKGP3.png';
import logout from '../../utils/images/logout.png';
import chassis from '../../utils/images/chassis.jpg';
import doc from '../../utils/images/doc.png';

import {URI} from '@env';

const CameraScreen = ({navigation, route}) => {
  const {height, width} = useWindowDimensions();
  const ref = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [gotResponse, setGotResponse] = useState(false);

  const [enableManualInput, setEnableManualInput] = useState(true);
  const [manualTIN, setManualTIN] = useState('');

  const [imageUri, setImageUri] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [base64, setBase64] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);

  const [deviceId, setDeviceId] = useState(null);

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
          // id: route.params.id,
          vin: route.params.vin,
          axle_location: selectedWheelData.axle_location,
          wheel_pos: selectedWheelData.wheel_pos,
          wheel_id: selectedWheelData.wheel_id,
          token: globalToken,
          uid: deviceId,
          forced_entry: true,
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
              AsyncStorage.setItem('token', '');
              AsyncStorage.setItem('ticket', '');
              AsyncStorage.setItem('isLoggedIn', '');
              console.log('Logout successful', response.data);
              // navigation.navigate('Login');
              navigation.navigate('LoginNav', {screen: 'Login'});
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

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await DeviceInfo.getAndroidId();
      setDeviceId(id);
      // console.log('deviceId from camera screen=', id);
    };

    fetchDeviceId();
  }, []);

  //Function for posting TIN data manually
  const putData = async () => {
    // Check if data is present
    // const dataToPut = {
    //   token: globalToken,
    //   data: manualTIN,
    //   id: route.params.id,
    //   vin: apiResponseData.vin,
    //   axle_location: selectedWheelData.axle_location,
    //   axle_id: selectedWheelData.axle_id,
    //   wheel_pos: selectedWheelData.wheel_pos,
    //   wheel_id: selectedWheelData.wheel_id,
    // };
    // console.log("Data to put:", dataToPut);
    // console.log("url:", `${URI + "/car_wdata/tin"}`);

    if (manualTIN) {
      try {
        const response = await axios.put(
          `${creden.URI + '/car_wdata/tin'}`,
          null,
          {
            params: {
              token: globalToken,
              data: manualTIN,
              uid: deviceId,
              // id: route.params.id,
              vin: route.params.vin,
              axle_location: selectedWheelData.axle_location,
              // axle_id: selectedWheelData.axle_id,
              wheel_pos: selectedWheelData.wheel_pos,
              wheel_id: selectedWheelData.wheel_id,
            },
            headers: {
              accept: 'application/json',
              // Authorization:
              // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU3NzYzOTIsInN1YiI6Ijc4OTQ1NiJ9.SERsXKqP1g5iV3Ly5zwmujj-9S3AgFKk2nvI8oPUMJI",
            },
          },
        );
        console.log('Response:', response.data);
        if (response.data) {
          dispatch(setTinGlobal(manualTIN));
          setManualTIN('');
          // setManualModal(false);
          Alert.alert(
            'TIN data saved successfully',
            'Do you want to proceed?',
            [
              {
                text: 'Re-enter',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Proceed',
                onPress: () => {
                  navigation.navigate('NewSmodel', {
                    model: route.params.model,
                    responseData: response.data.output,
                    vin: route.params.vin,
                    // id: route.params.id,
                    // elapsedTime: alertTime,
                  });
                },
              },
            ],
            {cancelable: false},
          );

          // fetchData();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      Alert.alert('Please enter the TIN No.');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: !enableManualInput ? '#fff' : 'black',
      }}>
      <TopTabs
        left={doc}
        center={logoApp}
        // right={question}
        // right={ham}
        // tabRightFunc={() => navigation.navigate('Profile')}
        tabLeftFunc={() => navigation.navigate('AboutApp')}
      />
      <View
        style={{
          position: 'absolute',
          zIndex: 1,
          top: height * 0.04,
          right: width * 0.06,
        }}>
        <Switch
          value={enableManualInput}
          onValueChange={() => setEnableManualInput(!enableManualInput)}
          activeText="Scan"
          inActiveText="Manual"
          circleSize={30}
          switchRightPx={5}
          // backgroundActive="#03c04a"
          backgroundActive="darkgreen"
          // backgroundInactive=''
          switchWidthMultiplier={3}
        />
      </View>
      {!enableManualInput ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'rgba(0, 0, 0, 0.5)',
            // backgroundColor: "red",
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              elevation: 5,
              justifyContent: 'center',
              alignItems: 'center',
              width: '80%',

              minHeight: 260,
              height: '35%',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: 'black',
              }}>
              Enter TIN
            </Text>

            <View
              style={{
                margin: 20,
                marginBottom: 5,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: 220,
                height: 40,
                // top: 160,
                borderRadius: 12,
                borderWidth: 1.5,
                // borderColor: '#3758ff',
                borderColor: '#0f113e',
                //   justifyContent: "center",
                alignItems: 'center',
                //   zIndex: 2,
                //   backgroundColor: "red",
              }}
              // onPress={() => navigation.navigate("Vmodel")}
            >
              {/* <Image
                  source={id}
                  style={{ resizeMode: "contain", height: 30, width: 30 }}
                ></Image> */}
              <View>
                <TextInput
                  placeholder="TIN no."
                  placeholderTextColor="grey"
                  style={{height: 40, width: 180, color: 'black'}}
                  value={manualTIN}
                  onChangeText={text => setManualTIN(text)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{
                width: 190,
                height: 40,
                marginTop: 20,
                borderRadius: 12,
                // borderWidth: 3,
                // borderColor: "#3758ff",
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                // backgroundColor: '#3758ff',
                backgroundColor: 'darkgreen',
              }}
              onPress={putData}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 17,
                  letterSpacing: 1,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : gotResponse ? (
        <View style={{backgroundColor: 'black', flex: 1, width: '100%'}}>
          {imgLoading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          {imageUri && (
            <Image
              source={{uri: imageUri}}
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
                  // borderColor: '#3758ff',
                  // borderColor: '#990000',
                  borderColor: '#0f113e',
                  // justifyContent: "center",
                  // alignItems: 'center',
                  // backgroundColor: "red",
                  padding: 5,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>
                  TIN: {headers['output']}
                </Text>
                <Text style={{color: 'black', fontWeight: 'bold'}}>
                  Make: {headers['make']}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 40,
                    // top: 160,
                    borderRadius: 12,
                    // borderWidth: 3,
                    // borderColor: "#3758ff",
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2,
                    // backgroundColor: '#3758ff',
                    // backgroundColor: '#03c04a',
                    backgroundColor: 'red',
                    marginTop: 5,
                  }}
                  onPress={() => {
                    // dispatch(setTinGlobal(headers['output']));
                    setGotResponse(false);
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 17,
                      letterSpacing: 1,
                    }}>
                    Rescan
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 40,
                    // top: 160,
                    borderRadius: 12,
                    // borderWidth: 3,
                    // borderColor: "#3758ff",
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2,
                    // backgroundColor: '#3758ff',
                    // backgroundColor: '#03c04a',
                    backgroundColor: 'darkgreen',
                    marginTop: 5,
                  }}
                  onPress={() => {
                    dispatch(setTinGlobal(headers['output']));
                    navigation.navigate('NewSmodel', {
                      model: route.params.model,
                      responseData: headers['output'],
                      vin: route.params.vin,
                      // id: route.params.id,
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
                    Proceed
                  </Text>
                </TouchableOpacity>
              </View>
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
                width: 220,
                height: 40,
                borderRadius: 12,
                // backgroundColor: '#3758ff',
                // backgroundColor: '#03c04a',
                backgroundColor: 'darkgreen',
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
                {streaming ? 'Capturing' : 'Capture'}
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
