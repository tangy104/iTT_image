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
  StyleSheet,
} from 'react-native';
import {Switch} from 'react-native-switch';
import {ScaledSheet, s, vs, ms} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {setTinGlobal} from '../../state/tinslice';
import {setCreden} from '../../state/credenSlice';
import {setSelectedWheelDataGlobal} from '../../state/selectSlice';
import {active, inactive} from '../../state/alertSlice';
// import {ApiVideoLiveStreamView} from '@api.video/react-native-livestream';
// import {Camera, CameraType} from 'expo-camera';
import {CameraView, useCameraPermissions} from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';

import TopTabs from '../../navigation/TopTabs';
import Tabs from '../../navigation/Tabs';

import logoApp from '../../utils/images/logoApp.png';
import dash from '../../utils/images/dash.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import logout from '../../utils/images/logout.png';
import doc from '../../utils/images/doc.png';
import flashIcon from '../../utils/images/flash.png';
import circarr from '../../utils/images/circarr.png';
import backS from '../../utils/images/backS.png';

const CameraScreen = ({navigation, route}) => {
  const {height, width} = useWindowDimensions();
  const ref = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [gotResponse, setGotResponse] = useState(false);

  const [hasError, setHasError] = useState(false);

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

  const [image64, setImage64] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [torch, setTorch] = useState(false);
  const [flash, setFlash] = useState(true);
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

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

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

  const isBase64 = str => {
    const base64Regex =
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(str);
  };

  //One click upload functionality for image
  const directUpload = async () => {
    setStreaming(true);
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        // setImage(data.uri);
        console.log(typeof image);

        // Compress the image before uploading
        const compressedImage = await ImageManipulator.manipulateAsync(
          data.uri,
          [{resize: {width: 1500}}], // Resize the image to a width of 800px
          {compress: 1, format: ImageManipulator.SaveFormat.JPEG}, // Compress and convert to JPEG format
        );
        setImage(compressedImage.uri);

        const formData = new FormData();
        formData.append('file', {
          // uri: data.uri,
          uri: compressedImage.uri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
        formData.append('vin', route.params.vin);
        formData.append('axle_location', selectedWheelData.axle_location);
        formData.append('wheel_pos', selectedWheelData.wheel_pos);
        formData.append('wheel_id', selectedWheelData.wheel_id);
        formData.append('token', globalToken);
        formData.append('uid', deviceId);
        formData.append('forced_entry', '');

        console.log('formdata is', formData);
        // Record the timestamp when starting the Axios request
        const startRequestTime = new Date().getTime();
        console.log('startRequestTime:', startRequestTime);

        const res = await axios.put(`${creden.URI}/car_wimg/tin`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Record the timestamp when receiving the response
        const endRequestTime = new Date().getTime();
        console.log('endRequestTime:', endRequestTime);

        const response = res.data;
        console.log('response from output', response);

        // Extract the times from the server response
        const {t2, timer_final: timerFinal, timer_start: timerStart} = response;
        // console.log('timer start', new Date(timerStart).getTime());
        // console.log('timer final', new Date(timerFinal).getTime());

        // Calculate the time taken for the image to reach the server
        const timeToReachServer =
          new Date(timerStart).getTime() - startRequestTime;

        // Calculate the time taken for the response to reach the mobile device
        const responseTime = endRequestTime - new Date(timerFinal).getTime();

        // console.log(
        //   `Time taken for the image to reach the server: ${
        //     timeToReachServer / 10000
        //   } s`,
        // );
        // console.log(
        //   `Time taken for the response to reach the mobile device: ${
        //     responseTime / 1000
        //   } s`,
        // );

        // Convert t2 from "HH:MM:SS.microseconds" to seconds
        const t2Parts = t2.split(':');
        const t2InSeconds =
          parseInt(t2Parts[0], 10) * 3600 + // hours to seconds
          parseInt(t2Parts[1], 10) * 60 + // minutes to seconds
          parseFloat(t2Parts[2]); // seconds and microseconds

        // console.log(`Time taken in the server: ${t2InSeconds}`);
        // console.log(
        //   'total time taken',
        //   (endRequestTime - startRequestTime) / 1000,
        // );
        // console.log(
        //   'time taken in communication:',
        //   (endRequestTime - startRequestTime) / 1000 - t2InSeconds,
        // );
        // console.log(
        //   'time taken to reach mobile device:',
        //   (endRequestTime - startRequestTime) / 1000 -
        //     t2InSeconds -
        //     timeToReachServer / 10000,
        // );
        const t1 = (new Date(timerStart).getTime() - startRequestTime) / 10000;
        const t3 =
          (endRequestTime - startRequestTime) / 1000 - t1 - t2InSeconds;
        console.log('t1:', t1);
        console.log('t2:', t2InSeconds);
        console.log('t3:', t3);
        console.log('server time:', t2InSeconds);
        console.log(
          'communication time:',
          (endRequestTime - startRequestTime) / 1000 - t2InSeconds,
        );
        console.log(
          'Total time taken:',
          (endRequestTime - startRequestTime) / 1000,
        );

        setHeaders(response);
      } catch (error) {
        setHasError(true);
        if (error.response) {
          // Server responded with a status other than 200 range
          console.log('Error response data:', error.response.data);
          console.log('Error response status:', error.response.status);
          console.log('Error response headers:', error.response.headers);

          if (error.response.status === 400) {
            setHeaders(error.response.data.detail);
          } else if (error.response.status === 404) {
            setHeaders(error.response.data.detail);
          } else if (error.response.status === 441) {
            setHeaders('No TIN detected\nReason: ROI cannot be found');
          } else if (error.response.status === 442) {
            setHeaders('No TIN detected\nReason: Badly captured ROI');
          } else if (error.response.status === 443) {
            setImage64(error.response.data.detail);
            setHeaders(
              'No TIN detected\nReason: Some characters cannot be detected',
            );
          } else if (error.response.status === 444) {
            setHeaders('No TIN detected\nReason: Model failed to detect');
          } else {
            setHeaders(error.response.data.detail);
          }
          // else if (isBase64(error.response.data.detail)) {
          //   // <Image
          //   //   source={{ uri: `data:image/jpeg;base64,${response.detail}` }}
          //   //   style={{ width: 200, height: 200 }}
          //   // />
          //   setImage64(error.response.data.detail);
          //   setHeaders('Please find the faulty text below.');
          // }
        } else if (error.request) {
          // Request was made but no response received
          console.log('Error request:', error.request);
          // setHeaders('No serial number detected');
          setHeaders('There was an error in server response');
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
                  dispatch(
                    setSelectedWheelDataGlobal({
                      axle_location: null,
                      wheel_pos: null,
                      wheel_id: null,
                      wheel_tin: null,
                    }),
                  );
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
        setHasError(true);
        console.error('Error:', error);
      }
    } else {
      Alert.alert('Please enter the TIN No.');
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setTorch(true);
      console.log('torch on');
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
          // left={doc}
          center={logoApp}
          // right={question}
          // right={ham}
          // tabRightFunc={() => navigation.navigate('Profile')}
          // tabLeftFunc={() => navigation.navigate('AboutApp')}
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
            onValueChange={() => {
              setEnableManualInput(!enableManualInput);
              setTimeout(() => {
                setTorch(false);
                console.log('torch off');
              }, 500);
            }}
            activeText="Enabled"
            inActiveText="Disabled"
            circleSize={32}
            switchRightPx={9}
            switchLeftPx={9}
            // backgroundActive="#03c04a"
            backgroundActive="darkgreen"
            // backgroundInactive=''
            switchWidthMultiplier={3}
            renderInsideCircle={() => (
              <Text
                style={{
                  color: 'black',
                  fontSize: ms(9),
                  fontWeight: 'bold',
                }}>
                Scan
              </Text>
            )}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            top: height * 0.04,
            left: width * 0.06,
          }}>
          <Switch
            value={flash}
            onValueChange={() => setFlash(!flash)}
            activeText="On"
            inActiveText="Off"
            circleSize={30}
            switchRightPx={2}
            // backgroundActive="#03c04a"
            backgroundActive="darkgreen"
            // backgroundInactive=''
            switchWidthMultiplier={2.7}
            renderInsideCircle={() => (
              // <Text
              //   style={{
              //     color: 'black',
              //     fontSize: ms(6),
              //     fontWeight: 'bold',
              //   }}>
              //   Flash
              // </Text>
              <Image
                source={flashIcon}
                style={{
                  resizeMode: 'contain',
                  height: vs(16),
                  width: s(16),
                }}
              />
            )}
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
                padding: s(20),
                borderRadius: ms(10),
                elevation: 5,
                justifyContent: 'center',
                alignItems: 'center',
                width: '80%',

                minHeight: vs(260),
                height: '35%',
              }}>
              <Text
                style={{
                  fontSize: ms(18),
                  fontWeight: 'bold',
                  marginBottom: vs(10),
                  color: 'black',
                }}>
                Enter TIN
              </Text>

              <View
                style={{
                  margin: ms(20), // Moderated scaling for both vertical and horizontal margins
                  marginBottom: vs(5), // Vertical scaling for bottom margin
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  width: s(220), // Horizontal scaling for width
                  height: vs(40), // Vertical scaling for height
                  borderRadius: ms(12), // Moderated scaling for border radius
                  borderWidth: ms(1.5), // Moderated scaling for border width
                  borderColor: '#0f113e',
                  alignItems: 'center',
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
                    style={{height: vs(40), width: s(180), color: 'black'}}
                    value={manualTIN}
                    onChangeText={text => setManualTIN(text)}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={{
                  width: s(190), // Horizontal scaling for width
                  height: vs(35), // Vertical scaling for height
                  marginTop: vs(20), // Vertical scaling for top margin
                  borderRadius: ms(12), // Moderated scaling for border radius
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2,
                  backgroundColor: 'darkgreen', // Keep the color as is
                }}
                onPress={putData}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: ms(17),
                    letterSpacing: ms(1),
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
              <>
                <Image
                  source={{uri: image}}
                  // source={chassis}
                  style={{
                    // width: '100%',
                    height: '100%',
                    marginBottom: vs(20),
                    resizeMode: 'cover',
                  }}
                  onLoadStart={() => setImgLoading(true)}
                  onLoad={() => setImgLoading(false)}
                  onLoadEnd={() => setImgLoading(false)}
                />
                {headers ===
                  'No TIN detected\nReason: Model failed to detect' && (
                  // 'No TIN detected\nReason: Some characters cannot be detected' && (
                  <View
                    style={{
                      height: '100%',
                      width: '30%',
                      marginLeft: '70%',
                      // backgroundColor: 'red',
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/* <View style={styles.halfCircle}>
                      
                      <View style={[styles.arrow, styles.topArrow]} />
                
                      <View style={[styles.arrow, styles.bottomArrow]} />
                    </View> */}
                    <Image
                      source={circarr}
                      style={{
                        resizeMode: 'contain',
                        height: vs(130),
                        width: s(200),
                      }}
                    />
                  </View>
                )}
              </>
            )}
            {headers && (
              <View
                style={{
                  top: '65%',
                  alignSelf: 'center',
                  position: 'absolute',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: s(15),
                  borderRadius: ms(10),
                  elevation: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '70%',
                  minHeight: vs(50),
                  height: '28%',
                }}>
                {
                  // headers === 'No serial number detected' ||
                  // headers ===
                  //   'No character detected while feeding to character detection model' ||
                  // headers === 'No serial number could be detected finally' ||
                  // headers === 'TIN already scanned'

                  hasError ? (
                    image64 ? (
                      <View
                        style={{
                          // top: '65%',
                          top: vs(-52),
                          alignSelf: 'center',
                          position: 'absolute',
                          backgroundColor: 'rgb(255, 255, 255)',
                          // padding: s(15),
                          borderRadius: ms(10),
                          elevation: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          // width: '100%',
                          width: s(320),
                          minHeight: vs(50),
                          // height: '28%',
                          height: vs(200),
                        }}>
                        <Text
                          style={{
                            fontSize: ms(12),
                            fontWeight: 'bold',
                            marginBottom: vs(1),
                            color: 'black',
                            textAlign: 'center',
                            borderTop: vs(10),
                          }}>
                          {headers}
                        </Text>
                        <Image
                          source={{
                            uri: `data:image/jpeg;base64,${image64}`,
                          }}
                          style={{
                            resizeMode: 'contain',
                            width: s(310),
                            height: vs(60),
                          }}
                        />

                        <Text
                          style={{
                            color: 'black',
                            textAlign: 'center',
                            marginBottom: 5,
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
                              width: s(100),
                              height: vs(40),
                              // top: 160,
                              borderRadius: ms(12),
                              // borderWidth: 3,
                              // borderColor: "#3758ff",
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 2,
                              // backgroundColor: '#3758ff',
                              // backgroundColor: '#03c04a',
                              backgroundColor: 'red',
                              marginTop: vs(5),
                            }}
                            onPress={() => {
                              // dispatch(setTinGlobal(headers['output']));
                              setHasError(false); // Reset the error state
                              setGotResponse(false);
                              setImage(null);
                              setImage64(null);
                              setHeaders(null);
                              setTimeout(() => {
                                setTorch(false);
                                console.log('torch off');
                              }, 500);
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: ms(17),
                                letterSpacing: 1,
                              }}>
                              Rescan
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: s(100),
                              height: vs(40),
                              // top: 160,
                              borderRadius: ms(12),
                              // borderWidth: 3,
                              // borderColor: "#3758ff",
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 2,
                              // backgroundColor: '#3758ff',
                              // backgroundColor: '#03c04a',
                              backgroundColor: 'darkgreen',
                              marginTop: vs(5),
                            }}
                            onPress={() => {
                              setEnableManualInput(!enableManualInput);
                              setHasError(false); // Reset the error state
                              setGotResponse(false);
                              setImage(null);
                              setImage64(null);
                              setHeaders(null);
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: ms(17),
                                letterSpacing: ms(1),
                              }}>
                              Manual
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <>
                        <Text
                          style={{
                            fontSize: ms(12),
                            fontWeight: 'bold',
                            marginBottom: vs(10),
                            color: 'black',
                            textAlign: 'center',
                          }}>
                          {/* {headers === 'TIN already scanned'
                      ? 'TIN already scanned'
                      : 'No TIN detected'} */}

                          {headers}
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
                              width: s(100),
                              height: vs(40),
                              // top: 160,
                              borderRadius: ms(12),
                              // borderWidth: 3,
                              // borderColor: "#3758ff",
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 2,
                              // backgroundColor: '#3758ff',
                              // backgroundColor: '#03c04a',
                              backgroundColor: 'red',
                              marginTop: vs(5),
                            }}
                            onPress={() => {
                              // dispatch(setTinGlobal(headers['output']));
                              setHasError(false); // Reset the error state
                              setGotResponse(false);
                              setImage(null);
                              setImage64(null);
                              setHeaders(null);
                              setTimeout(() => {
                                setTorch(false);
                                console.log('torch off');
                              }, 500);
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: ms(17),
                                letterSpacing: 1,
                              }}>
                              Rescan
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: s(100),
                              height: vs(40),
                              // top: 160,
                              borderRadius: ms(12),
                              // borderWidth: 3,
                              // borderColor: "#3758ff",
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 2,
                              // backgroundColor: '#3758ff',
                              // backgroundColor: '#03c04a',
                              backgroundColor: 'darkgreen',
                              marginTop: vs(5),
                            }}
                            onPress={() => {
                              setEnableManualInput(!enableManualInput);
                              setHasError(false); // Reset the error state
                              setGotResponse(false);
                              setImage(null);
                              setImage64(null);
                              setHeaders(null);
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: ms(17),
                                letterSpacing: ms(1),
                              }}>
                              Manual
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )
                  ) : (
                    <>
                      <Text
                        style={{
                          fontSize: ms(16),
                          fontWeight: 'bold',
                          // marginBottom: 10,
                          color: 'black',
                        }}>
                        Extracted Data
                      </Text>
                      <View
                        style={{
                          margin: s(2),
                          // marginTop: 15,
                          flexDirection: 'column',
                          justifyContent: 'space-evenly',
                          width: s(220),
                          // height: 40,
                          // top: 160,
                          borderRadius: ms(12),
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
                            width: s(100),
                            height: vs(40),
                            // top: 160,
                            borderRadius: ms(12),
                            // borderWidth: 3,
                            // borderColor: "#3758ff",
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 2,
                            // backgroundColor: '#3758ff',
                            // backgroundColor: '#03c04a',
                            backgroundColor: 'red',
                            marginTop: vs(5),
                          }}
                          onPress={() => {
                            // dispatch(setTinGlobal(headers['output']));
                            setGotResponse(false);
                            setHasError(false);
                            setImage(null);
                            setTimeout(() => {
                              setTorch(false);
                              console.log('torch off');
                            }, 500);
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: ms(17),
                              letterSpacing: ms(1),
                            }}>
                            Rescan
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: s(100),
                            height: vs(40),
                            // top: 160,
                            borderRadius: ms(12),
                            // borderWidth: 3,
                            // borderColor: "#3758ff",
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 2,
                            // backgroundColor: '#3758ff',
                            // backgroundColor: '#03c04a',
                            backgroundColor: 'darkgreen',
                            marginTop: vs(5),
                          }}
                          onPress={() => {
                            dispatch(
                              setSelectedWheelDataGlobal({
                                axle_location: null,
                                wheel_pos: null,
                                wheel_id: null,
                                wheel_tin: null,
                              }),
                            );
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
                              fontSize: ms(17),
                              letterSpacing: ms(1),
                            }}>
                            Proceed
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )
                }
              </View>
            )}
          </View>
        ) : image ? (
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
                  marginBottom: vs(20),
                  resizeMode: 'cover',
                }}
                onLoadStart={() => setImgLoading(true)}
                onLoad={() => setImgLoading(false)}
                onLoadEnd={() => setImgLoading(false)}
              />
            )}
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                top: '78%',
                left: '19%',
              }}>
              <TouchableOpacity
                style={{
                  width: s(220),
                  height: vs(40),
                  borderRadius: ms(12),
                  // backgroundColor: '#3758ff',
                  // backgroundColor: '#03c04a',
                  backgroundColor: 'darkgreen',
                  // alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 5,
                }}
                //onPress={() => {
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
                //directUpload();

                //}}
                disabled={streaming} // Disable button when processing
                // onPress={() => {
                //   if (!streaming) {
                //     directUpload();
                //   }
                // }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: ms(17),
                    fontWeight: 'bold',
                  }}>
                  {streaming ? 'Processing' : 'Capture'}
                </Text>
              </TouchableOpacity>
            </View>
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
                // flashMode={flash}
                flash={'off'}
                animateShutter={false}
                enableTorch={flash ? torch : false}
                zoom={zoom}>
                <View style={{position: 'relative', top: '78%'}}>
                  <TouchableOpacity
                    style={{
                      width: s(220),
                      height: vs(40),
                      borderRadius: ms(12),
                      // backgroundColor: '#3758ff',
                      // backgroundColor: '#03c04a',
                      backgroundColor: 'darkgreen',
                      // alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 5,
                    }}
                    disabled={streaming}
                    // onPress={() => {
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
                    // directUpload();

                    // }}
                    onPress={() => {
                      if (!streaming) {
                        directUpload();
                      }
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: ms(17),
                        fontWeight: 'bold',
                      }}>
                      {streaming ? 'Processing' : 'Capture'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
            </PinchGestureHandler>
          </View>
        )}

        <Tabs
          left={backS}
          center={logoKGP2}
          right={logout}
          tabLeftFunc={() => {
            // dispatch(
            //   setSelectedWheelDataGlobal({
            //     axle_location: null,
            //     wheel_pos: null,
            //     wheel_id: null,
            //     wheel_tin: null,
            //   }),
            // );
            // dispatch(setTinGlobal(headers['output']));
            navigation.navigate('NewSmodel', {
              model: route.params.model,
              // responseData: headers['output'],
              vin: route.params.vin,
              // id: route.params.id,
              // elapsedTime: alertTime,
            });
          }}
          tabRightFunc={handleLogout}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  halfCircleArrow: {
    width: 50,
    height: 90,
    borderWidth: 5,
    borderColor: 'black',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderLeftWidth: 0, // Remove left border
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: 'black',
    borderWidth: 5,
  },
  topArrow: {
    top: -10,
    left: -2,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
    transform: [{rotate: '45deg'}],
  },
  bottomArrow: {
    bottom: -10,
    left: -2,
    borderLeftWidth: 5,
    borderTopWidth: 5,
    transform: [{rotate: '-45deg'}],
  },
});

export default CameraScreen;
