import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {Switch} from 'react-native-switch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {setTinGlobal} from '../../state/tinslice';
import {setCreden} from '../../state/credenSlice';
import {active, inactive} from '../../state/alertSlice';
import {ApiVideoLiveStreamView} from '@api.video/react-native-livestream';
// import {Camera, CameraType} from 'expo-camera';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';

import TopTabs from '../../navigation/TopTabs';
import Tabs from '../../navigation/Tabs';

import logoApp from '../../utils/images/logoApp.png';
import dash from '../../utils/images/dash.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import logout from '../../utils/images/logout.png';
import doc from '../../utils/images/doc.png';

const CameraScreen = ({navigation, route}) => {
  const {height, width} = useWindowDimensions();
  const ref = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [gotResponse, setGotResponse] = useState(false);

  const [enableManualInput, setEnableManualInput] = useState(true);
  const [manualTIN, setManualTIN] = useState('');

  // const [imageUri, setImageUri] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);

  const [deviceId, setDeviceId] = useState(null);

  //   const [type, setType] = useState(Camera.Constants.Type.back);
  //   const [type, setType] = useState(Camera.Constants.Type.back);
  //   const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [torch, setTorch] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const cameraRef = useRef(null);

  const dispatch = useDispatch();
  const alert = useSelector(state => state.alert.value);
  const selectedWheelData = useSelector(
    state => state.app.selectedWheelDataGlobal,
  );

  const globalToken = useSelector(state => state.token.tokenGlobal);
  const creden = useSelector(state => state.creden.creden);

  const onPinchEvent = event => {
    if (event.nativeEvent.scale > 1) {
      setZoom(Math.min(zoom + 0.05, 1)); // Maximum zoom is 1
      // console.log('Zoom in', zoom);
    } else {
      setZoom(Math.max(zoom - 0.05, 0)); // Minimum zoom is 0
      // console.log('Zoom out', zoom);
    }
  };
  //For video
  // const updateData = async () => {
  //   try {
  //     const response = await axios.put(`${creden.URI}/car_wvid/`, null, {
  //       params: {
  //         stream_key: `${creden.ticket}`,
  //         vin: route.params.vin,
  //         axle_location: selectedWheelData.axle_location,
  //         wheel_pos: selectedWheelData.wheel_pos,
  //         wheel_id: selectedWheelData.wheel_id,
  //         token: globalToken,
  //         uid: deviceId,
  //         forced_entry: true,
  //       },
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //       responseType: 'arraybuffer',
  //     });
  //     ref.current?.stopStreaming();
  //     setStreaming(false);
  //     // Verify the base64 data
  //     const base64Image = response.request._response;
  //     // console.log('Base64 image data:', base64Image);
  //     console.log('response headers', response.headers);

  //     // Set the image URI to display the image
  //     const imageUrl = `data:image/jpg;base64,${base64Image}`;
  //     // console.log('imageURL', imageUrl);
  //     setImageUri(imageUrl);
  //     console.log('setImage', imageUri);
  //     setBase64(base64Image);
  //     setHeaders(response.headers);
  //     setGotResponse(true);
  //   } catch (error) {
  //     console.error('Error updating data:', error);
  //   } finally {
  //   }
  // };

  //For logout
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

  //For getting deviceId
  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await DeviceInfo.getAndroidId();
      setDeviceId(id);
      // console.log('deviceId from camera screen=', id);
    };

    fetchDeviceId();
  }, []);

  //   useEffect(() => {
  //     (async () => {
  //       MediaLibrary.requestPermissionsAsync();
  //       const cameraStatus = await Camera.requestCameraPermissionsAsync();
  //       setHasCameraPermission(cameraStatus.status === 'granted');
  //     })();
  //   }, []);

  const requestPermissionAgain = () => {
    Linking.openSettings();
  };

  useEffect(() => {
    if (hasCameraPermission?.granted) requestPermissionAgain();
  }, []);

  //For taking picture

  // const takePicture = async () => {
  //   if (cameraRef) {
  //     try {
  //       const data = await cameraRef.current.takePictureAsync();
  //       console.log(data);
  //       setImage(data.uri);
  //       console.log(typeof image);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // };

  //One click upload functionality for image
  const directUpload = async () => {
    setStreaming(true);
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
        console.log(typeof image);

        const formData = new FormData();
        formData.append('file', {
          uri: data.uri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
        formData.append('vin', route.params.vin);
        formData.append('axle_location', selectedWheelData.axle_location);
        formData.append('wheel_pos', selectedWheelData.wheel_pos);
        formData.append('wheel_id', selectedWheelData.wheel_id);
        formData.append('token', globalToken);
        formData.append('uid', deviceId);
        formData.append('forced_entry', true);

        console.log('formdata is', formData);

        const res = await axios.put(`${creden.URI}/car_wimg/tin`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const response = res.data;
        console.log('response from output', response);

        setHeaders(response);
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 200 range
          console.log('Error response data:', error.response.data);
          console.log('Error response status:', error.response.status);
          console.log('Error response headers:', error.response.headers);
          if (error.response.status === 404) {
            setHeaders(error.response.data.detail);
          }
        } else if (error.request) {
          // Request was made but no response received
          console.log('Error request:', error.request);
        } else {
          // Something else happened in setting up the request
          console.log('Error message:', error.message);
        }
        // console.log('Error config:', error.config);
      } finally {
        setStreaming(false);
        setGotResponse(true);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //   useEffect(() => {
  //     console.log('after posting the posted is', posted);
  //   }, [posted]);

  //Function for posting TIN data manually
  const putData = async () => {
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
              vin: route.params.vin,
              axle_location: selectedWheelData.axle_location,
              wheel_pos: selectedWheelData.wheel_pos,
              wheel_id: selectedWheelData.wheel_id,
            },
            headers: {
              accept: 'application/json',
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
  useEffect(() => {
    setTimeout(() => {
      setTorch(true);
    }, 1000);
  }, [torch]);

  return (
    <GestureHandlerRootView>
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
            {image && (
              <Image
                source={{uri: image}}
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
                {headers === 'No serial number detected' ? (
                  <>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 10,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      No TIN detected
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        textAlign: 'center',
                        marginBottom: 2,
                      }}>
                      Do you want to proceed with manual input?
                    </Text>
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
                          setImage(null);
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
                          setEnableManualInput(!enableManualInput);
                          setGotResponse(false);
                          setImage(null);
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 17,
                            letterSpacing: 1,
                          }}>
                          Manual
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
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
                        {/* TIN: {headers.output} */}
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
                          setImage(null);
                          setTimeout(() => {
                            setTorch(false);
                          }, 500);
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
                  </>
                )}
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
            <PinchGestureHandler
              onGestureEvent={onPinchEvent}
              onHandlerStateChange={onPinchEvent}>
              <CameraView
                style={{
                  flex: 1,
                  width: '100%',
                  //   justifyContent: 'center',
                  alignItems: 'center',
                }}
                // type={type}
                facing={'back'}
                ref={cameraRef}
                // flashMode={flash}>
                flash={'off'}
                animateShutter={false}
                enableTorch={torch}
                zoom={zoom}>
                <View style={{position: 'relative', top: '85%'}}>
                  <TouchableOpacity
                    style={{
                      width: 220,
                      height: 40,
                      borderRadius: 12,
                      // backgroundColor: '#3758ff',
                      // backgroundColor: '#03c04a',
                      backgroundColor: 'darkgreen',
                      // alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 5,
                    }}
                    onPress={() => {
                      //   if (streaming) {
                      //     ref.current?.stopStreaming();
                      //     setStreaming(false);
                      //   } else {
                      //     ref.current?.startStreaming(
                      //       `${creden.ticket}`,
                      //       creden.RTMP_URI,
                      //     );
                      //     setStreaming(true);
                      //     updateData();
                      //   }
                      directUpload();
                    }}>
                    <Text
                      style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
                      {streaming ? 'Capturing' : 'Capture'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
            </PinchGestureHandler>
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
    </GestureHandlerRootView>
  );
};

export default CameraScreen;
