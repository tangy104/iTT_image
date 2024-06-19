import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  useWindowDimensions,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import {Switch} from 'react-native-switch';
// import {IconButton, MD3Colors} from 'react-native-paper';
// import {BarCodeScanner} from 'expo-barcode-scanner';
import {CameraView, useCameraPermissions, Camera} from 'expo-camera';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import {setTokenGlobal} from '../../state/tokenslice';
import {setCreden} from '../../state/credenSlice';
import axios from 'axios';
import {URI} from '@env';
import {SafeAreaView} from 'react-native-safe-area-context';

import TopTabs from '../../navigation/TopTabs';
import Tabs from '../../navigation/Tabs';

import logoApp from '../../utils/images/logoApp.png';
import ham from '../../utils/images/ham.png';
import question from '../../utils/images/question.png';
import dash from '../../utils/images/dash.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import logout from '../../utils/images/logout.png';
import barcode from '../../utils/images/barcode.png';
import logoKGP3 from '../../utils/images/logoKGP3.png';
// import { TouchableOpacity } from "react-native-web";

const BarcodeScannerScreen = ({navigation}) => {
  const dummy = {
    id: '6606e22d22b572245fd562f0',
    mod_num: '20T Rigid',
    vin: '1000',
    vc: '1234',
    num_axles: 3,
    imguri:
      'https://tatatrucks.tatamotors.com/images/tata-heavy-medium-trucks/tata-increased-axle-load-range/tata-lpt-signa-2818/overview-tata-lpt-signa-2818.png',
    car_record_created_by: 'lemon',
    axles_data: [
      {
        axle_location: 'Front',
        axle_type: '1',
        axle_id: 1,
        wheels_data: [
          {
            wheel_pos: 'L',
            wheel_id: 1,
            tin: '46000366',
            make: null,
            size: null,
            scn_year: 2024,
            scn_month: 3,
            scn_day: 29,
            scn_compound: 20240329,
            wheel_record_last_edited_by: 'lemon',
            img_filename: '1000_Front_1_L_1_46000366.jpg',
          },
          {
            wheel_pos: 'R',
            wheel_id: 1,
            tin: null,
            make: null,
            size: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
        ],
      },
      {
        axle_location: 'Back',
        axle_type: '2',
        axle_id: 1,
        wheels_data: [
          {
            wheel_pos: 'L',
            wheel_id: 1,
            tin: null,
            make: null,
            size: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'L',
            wheel_id: 2,
            tin: null,
            make: null,
            size: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'R',
            wheel_id: 1,
            tin: null,
            make: null,
            size: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'R',
            wheel_id: 2,
            tin: null,
            make: null,
            size: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
        ],
      },
      {
        axle_location: 'Back',
        axle_type: '2',
        axle_id: 2,
        wheels_data: [
          {
            wheel_pos: 'L',
            wheel_id: 1,
            tin: null,
            make: null,
            size: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'L',
            wheel_id: 2,
            tin: null,
            make: null,
            size: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'R',
            wheel_id: 1,
            tin: null,
            make: null,
            size: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'R',
            wheel_id: 2,
            tin: null,
            make: null,
            size: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
        ],
      },
    ],
  };

  const dispatch = useDispatch();
  const globalToken = useSelector(state => state.token.tokenGlobal);
  const creden = useSelector(state => state.creden.creden);
  // console.log('globalToken in scanVIN:', globalToken);

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const frameWidth = windowWidth * 0.5;
  const frameHeight = frameWidth * 0.5;

  // const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned1, setScanned1] = useState(false);
  const [scanned2, setScanned2] = useState(false);
  const [barcode1, setBarcode1] = useState('');
  const [barcode2, setBarcode2] = useState('');
  const [manualInput1, setManualInput1] = useState('');
  const [manualInput2, setManualInput2] = useState('');
  const [loading, setLoading] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [zoom, setZoom] = useState(0);

  const onPinchEvent = event => {
    if (event.nativeEvent.scale > 1) {
      setZoom(Math.min(zoom + 0.05, 1)); // Maximum zoom is 1
      // console.log('Zoom in', zoom);
    } else {
      setZoom(Math.max(zoom - 0.05, 0)); // Minimum zoom is 0
      // console.log('Zoom out', zoom);
    }
  };

  // if (!permission) {
  //   // Camera permissions are still loading.
  //   return <View />;
  // }

  // if (!permission.granted) {
  //   // Camera permissions are not granted yet.
  //   return (
  //     <View style={styles.container}>
  //       <Text style={{textAlign: 'center'}}>
  //         We need your permission to show the camera
  //       </Text>
  //       <Button onPress={requestPermission} title="grant permission" />
  //     </View>
  //   );
  // }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({type, data}) => {
    setLoading(true);
    console.log('barcodedata', data);
    console.log('barcodetype', type);

    if (type) {
      if (!scanned1 || (scanned1 && data !== barcode1)) {
        console.log('Scanned data length:', data.length);

        if (!scanned1 && data.length === 17) {
          setBarcode1(data);
          setScanned1(true);
        } else if (!scanned2 && data.length === 12) {
          setBarcode2(data);
          setScanned2(true);
        } else {
          console.log('Invalid barcode');
          // Show an error message
          // Alert.alert("Error", "Invalid barcode");
        }
      }
    }

    setLoading(false);
  };

  // const postBarcodeData = async () => {
  //   let response;

  //   try {
  //     setLoading(true); // Set loading to true before making the request

  //     // Make a GET request to fetch cars data
  //     const getCarsResponse = await axios.get(`${creden.URI}/cars/`, {
  //       params: {
  //         token: globalToken,
  //       },
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     });

  //     // Check if the VIN number already exists
  //     const existingCar = getCarsResponse.data.cars.find(
  //       car => car.vin === barcode1,
  //     );

  //     if (existingCar) {
  //       // If the VIN number already exists, extract the ID of the existing entry
  //       // const existingCarId = existingCar.id;
  //       const existingCarVIN = existingCar.vin;

  //       // console.log('Existing car ID:', existingCarId);

  //       // Navigate to the "Smodel" screen with the existing car ID
  //       navigation.replace('NewSmodel', {
  //         title: 'MHCV Model' + ' ' + existingCarVIN,
  //         model: existingCar,
  //         // id: existingCarId,
  //         vin: existingCarVIN,
  //       });
  //     } else {
  //       // If the VIN number does not exist, perform a POST request to create a new entry
  //       response = await axios.post(creden.URI + `/cars_w_vin_vc`, null, {
  //         params: {
  //           token: globalToken,
  //           vin: barcode1,
  //           vc: barcode2,
  //         },
  //         headers: {
  //           Accept: 'application/json',
  //           // Authorization: "Bearer lemon",
  //         },
  //       });

  //       // console.log("response data:", response.data);

  //       navigation.replace('NewSmodel', {
  //         title: 'MHCV Model' + ' ' + `${response.data.vin}`,
  //         model: response.data,
  //         // id: response.data.id,
  //         vin: response.data.vin,
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const postBarcodeData = async () => {
    let response;
    try {
      setLoading(true); // Set loading to true before making the request
      // If the VIN number does not exist, perform a POST request to create a new entry
      response = await axios.post(creden.URI + `/cars_w_vin_vc`, null, {
        params: {
          token: globalToken,
          vin: barcode1,
          vc: barcode2,
        },
        headers: {
          Accept: 'application/json',
          // Authorization: "Bearer lemon",
        },
      });
      // console.log("response data:", response.data);

      navigation.replace('NewSmodel', {
        title: 'MHCV Model' + ' ' + `${response.data.vin}`,
        model: response.data,
        // id: response.data.id,
        vin: response.data.vin,
      });
    } catch (error) {
      // Handle the error response
      if (error.response && error.response.status === 403) {
        console.error(error.response.data.detail);
        async () => {
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
          } catch (error) {
            console.error('Error logging out', error);
          }
        },
          // Show an alert and navigate to the login page
          Alert.alert(
            'Invalid Credentials',
            'Your shift has ended. Please log in again to continue.',
            [
              {
                text: 'OK',
                onPress: () =>
                  navigation.navigate('LoginNav', {screen: 'Login'}), // Navigate to the login page
              },
            ],
            {cancelable: false},
          );
      } else if (error.response && error.response.status === 401) {
        console.error(error.response.data.detail);
        dispatch(
          setCreden({
            ticket: null,
            URI: creden.URI,
            WS_URI: creden.WS_URI,
            RTMP_URI: creden.RTMP_URI,
          }),
        );
        // Show an alert and navigate to the login page
        Alert.alert(
          'Invalid Credentials',
          'Your shift has ended. Please log in again to continue.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('LoginNav', {screen: 'Login'}), // Navigate to the login page
            },
          ],
          {cancelable: false},
        );
      } else if (error.response && error.response.status === 404) {
        console.error(error.response.data.detail);
        // Show an alert and navigate to the login page
        Alert.alert(
          `Alert,${error.response.data.detail}`,
          'Please check the VIN and VC details and try again',
          [
            {
              text: 'OK',
              // onPress: () => navigation.navigate('LoginNav', {screen: 'Login'}), // Navigate to the login page
            },
          ],
          {cancelable: false},
        );
      } else {
        console.error('Error fetching data:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  const postManualData = async () => {
    let response;
    try {
      setLoading(true); // Set loading to true before making the request
      // If the VIN number does not exist, perform a POST request to create a new entry
      response = await axios.post(creden.URI + `/cars_w_vin_vc`, null, {
        params: {
          token: globalToken,
          vin: manualInput1,
          vc: manualInput2,
        },
        headers: {
          Accept: 'application/json',
          // Authorization: "Bearer lemon",
        },
      });
      // console.log("response data:", response.data);

      navigation.replace('NewSmodel', {
        title: 'MHCV Model' + ' ' + `${response.data.vin}`,
        model: response.data,
        // id: response.data.id,
        vin: response.data.vin,
      });
    } catch (error) {
      // Handle the error response
      if (
        error.response &&
        (error.response.status === 403 || error.response.status === 401)
      ) {
        console.error(error.response.data.detail);
        async () => {
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
          } catch (error) {
            console.error('Error logging out', error);
          }
        },
          // Show an alert and navigate to the login page
          Alert.alert(
            'Invalid Credentials',
            'Your shift has ended. Please log in again to continue.',
            [
              {
                text: 'OK',
                onPress: () =>
                  navigation.navigate('LoginNav', {screen: 'Login'}), // Navigate to the login page
              },
            ],
            {cancelable: false},
          );
      } else if (error.response && error.response.status === 404) {
        console.error(error.response.data.detail);
        // Show an alert and navigate to the login page
        Alert.alert(
          `Alert,${error.response.data.detail}`,
          'Please check the VIN and VC details and try again',
          [
            {
              text: 'OK',
              // onPress: () => navigation.navigate('LoginNav', {screen: 'Login'}), // Navigate to the login page
            },
          ],
          {cancelable: false},
        );
      } else {
        console.error('Error fetching data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // const postManualData = async () => {
  //   let response;

  //   try {
  //     setLoading(true); // Set loading to true before making the request

  //     // Make a GET request to fetch cars data
  //     const getCarsResponse = await axios.get(`${creden.URI}/cars/`, {
  //       params: {
  //         token: globalToken,
  //       },
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     });

  //     // Check if the VIN number already exists
  //     const existingCar = getCarsResponse.data.cars.find(
  //       car => car.vin === manualInput1,
  //     );

  //     if (existingCar) {
  //       // If the VIN number already exists, extract the ID of the existing entry
  //       // const existingCarId = existingCar.id;
  //       const existingCarVIN = existingCar.vin;

  //       // console.log('Existing car ID:', existingCarId);

  //       // Navigate to the "Smodel" screen with the existing car ID
  //       navigation.replace('NewSmodel', {
  //         title: 'MHCV Model' + ' ' + existingCarVIN,
  //         model: existingCar,
  //         // id: existingCarId,
  //         vin: existingCarVIN,
  //       });
  //     } else {
  //       // If the VIN number does not exist, perform a POST request to create a new entry
  //       response = await axios.post(creden.URI + `/cars_w_vin_vc`, null, {
  //         params: {
  //           token: globalToken,
  //           vin: manualInput1,
  //           vc: manualInput2,
  //         },
  //         headers: {
  //           Accept: 'application/json',
  //           // Authorization: "Bearer lemon",
  //         },
  //       });

  //       // console.log("response data:", response.data);

  //       navigation.navigate('NewSmodel', {
  //         title: 'MHCV Model' + ' ' + `${response.data.vin}`,
  //         model: response.data,
  //         // id: response.data.id,
  //         vin: response.data.vin,
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePostData = () => {
    if (barcode1 && barcode2) {
      postBarcodeData();
    }
  };

  const handleManualPostData = () => {
    if (manualInput1 && manualInput2) {
      postManualData();
    } else {
      Alert.alert('Alert', 'Please enter the VIN and VC details');
    }
  };

  const handleScanAgain = () => {
    setScanned1(false);
    setScanned2(false);
    setBarcode1('');
    setBarcode2('');
    setManualInput1('');
    setManualInput2('');
  };

  const renderScanButton = () => {
    if (scanned1 || scanned2) {
      return (
        <TouchableOpacity
          style={{
            width: 220,
            height: 40,
            // top: 70,
            borderRadius: 12,
            // borderWidth: 3,
            // borderColor: "#3758ff",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            // backgroundColor: '#3758ff',
            backgroundColor: 'darkgreen',
          }}
          onPress={handleScanAgain}>
          <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
            Rescan
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderPostButton = () => {
    if (scanned1 && scanned2) {
      return (
        <TouchableOpacity
          style={{
            width: 220,
            height: 40,
            top: 5,
            borderRadius: 12,
            // borderWidth: 3,
            // borderColor: "#3758ff",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            // backgroundColor: '#3758ff',
            backgroundColor: 'darkgreen',
          }}
          onPress={handlePostData}
          // onPress={() => {
          //   navigation.navigate("Smodel", {
          //     title: "MHCV Model",
          //     model: dummy,
          //     id: "6606e22d22b572245fd562f0",
          //   });
          // }}
        >
          <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
            Proceed
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  if (hasPermission === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'black'}}>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'black'}}>No access to camera</Text>
    </View>;
  }
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
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <TopTabs
          left={ham}
          center={logoApp}
          // right={question}
          tabLeftFunc={() => navigation.navigate('Profile')}
          // tabRightFunc={() => navigation.navigate('AboutApp')}
        />
        <View style={{position: 'absolute', zIndex: 1, top: '4%', right: '6%'}}>
          <Switch
            value={switchValue}
            onValueChange={() => setSwitchValue(!switchValue)}
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
        {switchValue ? (
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={[styles.scannerContainer]}>
              <PinchGestureHandler
                onGestureEvent={onPinchEvent}
                onHandlerStateChange={onPinchEvent}>
                <CameraView
                  onBarcodeScanned={handleBarCodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: [
                      'aztec',
                      'ean13',
                      'ean8',
                      'qr',
                      'pdf417',
                      'upc_e',
                      'datamatrix',
                      'code39',
                      'code93',
                      'itf14',
                      'codabar',
                      'code128',
                      'upc_a',
                    ],
                  }}
                  style={[
                    StyleSheet.absoluteFillObject,
                    {borderWidth: 2, borderColor: 'black'},
                  ]}
                  zoom={zoom}

                  // style={{height: "50%", width: "100%"}}
                />
              </PinchGestureHandler>

              <View
                style={[
                  styles.frame,
                  {
                    width: frameWidth,
                    height: frameHeight,
                  },
                ]}></View>
              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#31367b"
                  style={styles.loadingIndicator}
                />
              )}
            </View>
            {/* {renderScanButton()} */}

            <View style={[styles.inputContainer, {width: windowWidth}]}>
              <View
                style={{
                  margin: 20,
                  marginBottom: 0,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  width: '80%',
                  height: 40,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  // borderColor: '#3758ff',
                  borderColor: '#0f113e',
                  //   justifyContent: "center",
                  alignItems: 'center',
                  //   zIndex: 2,
                }}>
                <Image
                  source={barcode}
                  style={{
                    resizeMode: 'contain',
                    height: 28,
                    width: 28,
                    right: 20,
                  }}></Image>
                <View>
                  {barcode1 ? (
                    <Text
                      style={{
                        height: 40,
                        width: 180,
                        right: 40,
                        fontSize: 15,
                        top: 10,
                        color: 'black',
                      }}>
                      {barcode1}
                    </Text>
                  ) : (
                    // <TextInput
                    //   placeholder="VIN no."
                    //   placeholderTextColor="grey"
                    //   style={{height: 40, width: 180, right: 40, fontSize: 15}}
                    // />
                    <Text
                      style={{
                        height: 40,
                        width: 180,
                        right: 40,
                        fontSize: 15,
                        top: 10,
                        color: 'grey',
                      }}>
                      VIN no.
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={{
                  margin: 20,
                  marginBottom: 4,
                  marginTop: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  width: '80%',
                  height: 40,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  // borderColor: '#3758ff',
                  borderColor: '#0f113e',
                  //   justifyContent: "center",
                  alignItems: 'center',
                  //   zIndex: 2,
                }}>
                <Image
                  source={barcode}
                  style={{
                    resizeMode: 'contain',
                    height: 28,
                    width: 28,
                    right: 20,
                  }}></Image>
                <View>
                  {barcode2 ? (
                    <Text
                      style={{
                        height: 40,
                        width: 180,
                        right: 40,
                        fontSize: 15,
                        top: 10,
                        color: 'black',
                      }}>
                      {barcode2}
                    </Text>
                  ) : (
                    // <TextInput
                    //   placeholder="VC no."
                    //   placeholderTextColor="grey"
                    //   style={{height: 40, width: 180, right: 40, fontSize: 15}}
                    // />
                    <Text
                      style={{
                        height: 40,
                        width: 180,
                        right: 40,
                        fontSize: 15,
                        top: 10,
                        color: 'grey',
                      }}>
                      VC no.
                    </Text>
                  )}
                </View>
              </View>
              {/* <View style={styles.inputbar}>
          <TextInput
            style={styles.input}
            placeholder={barcode1 ? barcode1 : "VIN no."}
            value={manualInput1}
            keyboardType="numeric"
            // placeholderTextColor="black"
            onChangeText={(text) => setManualInput1(text)}
          />
        </View>
        <View style={styles.inputbar}>
          <TextInput
            style={styles.input}
            placeholder={barcode2 ? barcode2 : "VC no."}
            value={manualInput2}
            keyboardType="numeric"
            // placeholderTextColor="black"
            onChangeText={(text) => setManualInput2(text)}
          />
        </View> */}

              {renderScanButton()}
              {renderPostButton()}
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f2f2f2',
              width: windowWidth,
            }}>
            <Text
              style={{
                fontSize: 17,
                color: '#7f7f7f',
                textAlign: 'center',
                // top: 10,
                bottom: 30,
              }}>
              Enter the of VIN and VC details of the vehicle
            </Text>
            <View
              style={{
                margin: 20,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '80%',
                height: 40,
                borderRadius: 12,
                borderWidth: 1.5,
                // borderColor: '#3758ff',
                borderColor: '#0f113e',
                //   justifyContent: "center",
                alignItems: 'center',
                //   zIndex: 2,
              }}>
              <Image
                source={barcode}
                style={{
                  resizeMode: 'contain',
                  height: 28,
                  width: 28,
                  right: 20,
                }}></Image>
              <View>
                <TextInput
                  style={{
                    height: 40,
                    width: 180,
                    right: 40,
                    fontSize: 15,
                    color: 'black',
                  }}
                  placeholder="VIN no."
                  value={manualInput1}
                  // keyboardType="numeric"
                  placeholderTextColor="grey"
                  onChangeText={text => setManualInput1(text)}
                />
              </View>
            </View>
            <View
              style={{
                margin: 20,
                marginTop: 6,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '80%',
                height: 40,
                borderRadius: 12,
                borderWidth: 1.5,
                // borderColor: '#3758ff',
                borderColor: '#0f113e',
                //   justifyContent: "center",
                alignItems: 'center',
                //   zIndex: 2,
              }}>
              <Image
                source={barcode}
                style={{
                  resizeMode: 'contain',
                  height: 28,
                  width: 28,
                  right: 20,
                }}></Image>
              <View>
                <TextInput
                  style={{
                    height: 40,
                    width: 180,
                    right: 40,
                    fontSize: 15,
                    color: 'black',
                  }}
                  placeholder="VC no."
                  value={manualInput2}
                  // keyboardType="numeric"
                  placeholderTextColor="grey"
                  onChangeText={text => setManualInput2(text)}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: 220,
                height: 40,
                top: 40,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                // backgroundColor: '#3758ff',
                backgroundColor: 'darkgreen',
              }}
              onPress={handleManualPostData}>
              <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
                Proceed
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {!keyboardVisible && (
          <Tabs
            left={dash}
            center={logoKGP2}
            right={logout}
            tabLeftFunc={() => navigation.navigate('Dashboard')}
            tabRightFunc={handleLogout}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default BarcodeScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainer: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // backgroundColor: "black",
  },
  frame: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    // flex: 1,
    alignItems: 'center',

    // width: '100%',
    backgroundColor: '#f2f2f2',
    // backgroundColor: 'pink',
    bottom: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    margin: 10,
    paddingHorizontal: 10,
  },
  inputbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
});
