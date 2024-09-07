import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ImageBackground,
  TextInput,
  useWindowDimensions,
  Alert,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScaledSheet, s, vs, ms} from 'react-native-size-matters';
import DeviceInfo from 'react-native-device-info';
import Dialog from 'react-native-dialog';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {LinearGradient} from 'expo-linear-gradient';
// import { useFonts } from "expo-font";
// import {useFonts, allura, Allura_400Regular} from '@expo-google-fonts/allura';
// import AppLoading from "expo-app-loading";
// import {Formik} from 'formik';
// import * as Yup from 'yup';
// import Animated, {
//   FadeIn,
//   FadeOut,
//   FadeInUp,
//   FadeInDown,
// } from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {
  connectWebSocket,
  startScreenCapture,
  stopScreenCapture,
} from '../../state/screenSharingSlice';
import axios from 'axios';
import {setTokenGlobal} from '../../state/tokenslice';
import {setCreden} from '../../state/credenSlice';

import Tabs from '../../navigation/Tabs';
import TopTabs from '../../navigation/TopTabs';

import image from '../../utils/images/light.png';
import backgroundImage from '../../utils/images/backgroundImage.png';
import logoTATA from '../../utils/images/logoTATA.png';
import logoApp from '../../utils/images/logoApp.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import logoKGP3 from '../../utils/images/logoKGP3.png';
import id from '../../utils/images/id.png';
import dash from '../../utils/images/dash.png';
import logout from '../../utils/images/logout.png';
import logoTyre from '../../utils/images/logoTyre.png';
import question from '../../utils/images/question.png';
import ham from '../../utils/images/ham.png';
import chassis from '../../utils/images/scanVINChassis.png';
import addVC from '../../utils/images/addVC.png';
import doc from '../../utils/images/doc.png';

// import GoodVibes from "../../../assets/fonts/GreatVibes-Regular.ttf";
import {URI} from '@env';

// const windowWidth = useWindowDimensions().width;

// const validationSchema = Yup.object().shape({
//   // email: Yup.string().email("Invalid email").required("Email is required"),
//   email: Yup.string().required('Email is required'),
//   password: Yup.string().required('Password is required'),
// });

const ScanVIN = ({navigation}) => {
  //   const [fontsLoaded] = useFonts({
  //     allura,
  //     Allura_400Regular,
  //   });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isCurrentlyNotLogged, setIsCurrentlyNotLogged] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  const dispatch = useDispatch();
  const globalToken = useSelector(state => state.token.tokenGlobal);
  const creden = useSelector(state => state.creden.creden);

  const {isCapturing, isConnected} = useSelector(state => state.screenSharing);

  console.log('uri_new-', creden.URI);
  console.log('ws_uri-', creden.WS_URI);
  console.log('ticket-', creden.ticket);

  console.log('URI:', URI);

  const checkLogin = async () => {
    // const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    const token = await AsyncStorage.getItem('token');
    const ticket = await AsyncStorage.getItem('ticket');
    const zone = await AsyncStorage.getItem('zone');
    dispatch(setTokenGlobal(token));
    console.log('token from scan vin:', token);
    dispatch(
      setCreden({
        ticket: ticket,
        zone: zone,
        URI: creden.URI,
        WS_URI: creden.WS_URI,
        RTMP_URI: creden.RTMP_URI,
      }),
    );

    // console.log('at main home', data);
    // setIsLoggedIn(data === 'true');
  };

  const shiftExist = async () => {
    const ticketNumber = await AsyncStorage.getItem('ticket');
    let response;
    try {
      response = await axios.get(creden.URI + `/current_users/`, null, {
        headers: {
          Accept: 'application/json',
        },
      });
      console.log('response data for current users:', response.data);
      // Get the data from the response
      const currentUsers = response.data;
      // Check if the ticket number is currently logged in
      if (!currentUsers.includes(ticketNumber)) {
        // If it doesn't exist, make the POST request
        // await axios.post(`${creden.URI}/login?ticket_no_in=${ticketNumber}`, null, {
        //     headers: {
        //         'Accept': 'application/json',
        //     },
        // });
        // console.log(`Logged in with ticket number: ${ticketNumber}`);
        setIsCurrentlyNotLogged(true);
      } else {
        console.log(`Ticket number ${ticketNumber} already logged in`);
      }
    } catch (error) {
      console.error('Error occurred in checking current users:', error);
    }
  };

  const handleBackPress = () => {
    navigation.navigate('StackHome');
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }),
  );

  const fetchDeviceId = async () => {
    const id = await DeviceInfo.getAndroidId();
    setDeviceId(id);
    console.log('deviceId=', deviceId);
  };

  useEffect(() => {
    fetchDeviceId();
    checkLogin();
    shiftExist();
  }, []);

  function changePort(url, newPort) {
    // Regular expression to match the port number
    const regex = /:(\d{4})/;
    return url.replace(regex, `:${newPort}`);
  }

  useEffect(() => {
    const newUrl = changePort(creden.WS_URI, '1338');
    console.log('newUrl:', newUrl);

    dispatch(connectWebSocket(newUrl));

    return () => {
      dispatch(stopScreenCapture());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deviceId) {
      setTimeout(() => {
        handleStartCapture();
      }, 800);
    }
  }, [deviceId]); // Only call handleStartCapture when deviceId is updated

  // const handleStartCapture = async () => {
  //   const ticketNumber = await AsyncStorage.getItem('ticket');
  //   console.log('deviceId in start capture:', deviceId);
  //   if (deviceId === 'f80b60565be51cba' || deviceId === 'ce52f8bf60f2db5f') {
  //     dispatch(startScreenCapture('device1', ticketNumber));
  //     console.log('HHT01');
  //   } else if (
  //     deviceId === '3f879629b94e3dc0' ||
  //     deviceId === '546c2b6e3a136ed5'
  //   ) {
  //     dispatch(startScreenCapture('device2', ticketNumber));
  //     console.log('HHT02');
  //   } else if (
  //     deviceId === '04dfb65d0da8d600' ||
  //     deviceId === 'fdc1142eb2069aef'
  //   ) {
  //     dispatch(startScreenCapture('device3', ticketNumber));
  //     console.log('HHT03');
  //   } else if (deviceId === '25fabf8dca53aa2e') {
  //     dispatch(startScreenCapture('device4', ticketNumber));
  //     console.log('HHT04');
  //   } else {
  //     console.log('HHT not registered');
  //   }
  // };

  const handleStartCapture = async () => {
    const ticketNumber = await AsyncStorage.getItem('ticket');
    console.log('deviceId in start capture:', deviceId);
    if (deviceId === '2920cf7630acdfb3') {
      dispatch(startScreenCapture('device1', ticketNumber));
      console.log('HHT01');
    } else if (deviceId === '05e935b6c106609a') {
      dispatch(startScreenCapture('device2', ticketNumber));
      console.log('HHT02');
    } else if (deviceId === '65127fcf0577844d') {
      dispatch(startScreenCapture('device3', ticketNumber));
      console.log('HHT03');
    } else if (deviceId === '25fabf8dca53aa2e') {
      dispatch(startScreenCapture('device4', ticketNumber));
      console.log('HHT04');
    } else {
      console.log('HHT not registered');
    }
  };

  //posting by axios
  const handleLogin = async values => {
    try {
      // Check if email and password are provided
      if (!values.email || !values.password) {
        // Show an alert if either email or password is missing
        Alert.alert('Please enter both email and password.');
        return;
      }
      // Serialize the values object to plain JavaScript object
      const serializedValues = JSON.parse(JSON.stringify(values));

      const formData = new URLSearchParams();
      formData.append('grant_type', '');
      // formData.append("username", values.email);
      formData.append('username', 'lemon');
      // formData.append("password", values.password);
      formData.append('password', 'tangy');
      formData.append('scope', '');
      formData.append('client_id', '');
      formData.append('client_secret', '');

      console.log('Login Information:', formData);

      const response = await axios.post(
        creden.URI + '/login/',
        formData.toString(),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // Assuming the server responds with a token
      const token = response.data.access_token;
      dispatch(setTokenGlobal(token));

      // Handle the token as needed (e.g., store it in a secure location)
      console.log('Login successful! token:', globalToken);

      // Navigate to the next screen after successful login
      navigation.navigate('Vmodel');
    } catch (error) {
      console.error('Error during login:', error.message);
      // Check if the error is due to invalid credentials (unauthorized)
      if (error.response && error.response.status === 401) {
        Alert.alert('Invalid username or password. Please try again.');
      } else {
        // Handle other types of errors as needed
        Alert.alert('Invalid credentials. Please try again.');
      }
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  // const handleLogin = (values) => {
  //   try {

  // // Check if email and password are provided
  // if (!values.email || !values.password) {
  //   // Show an alert if either email or password is missing
  //   alert("Please enter both email and password.");
  //   return;
  // }
  //     // Log the extracted login information to the console
  //     console.log("Login Information:", values);

  //     // Navigate to the next screen after successful login
  //     navigation.navigate("Vmodel");
  //   } catch (error) {
  //     console.error("Error during login:", error.message);
  //     // Handle the error as needed (e.g., show an error message to the user)
  //   }
  // };

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
                  zone: null,
                  URI: creden.URI,
                  WS_URI: creden.WS_URI,
                  RTMP_URI: creden.RTMP_URI,
                }),
              );
              AsyncStorage.setItem('token', '');
              AsyncStorage.setItem('ticket', '');
              AsyncStorage.setItem('zone', '');
              AsyncStorage.setItem('isLoggedIn', '');
              console.log('Logout successful', response.data);
              // navigation.navigate('Login');
              navigation.navigate('LoginNav', {screen: 'Login'});
            } catch (error) {
              if (error.response && error.response.status === 403) {
                console.error(error.response.data.detail);
                dispatch(
                  setCreden({
                    ticket: null,
                    zone: null,
                    URI: creden.URI,
                    WS_URI: creden.WS_URI,
                    RTMP_URI: creden.RTMP_URI,
                  }),
                );
                AsyncStorage.setItem('token', '');
                AsyncStorage.setItem('ticket', '');
                AsyncStorage.setItem('zone', '');
                AsyncStorage.setItem('isLoggedIn', '');
                // console.log('Logout successful', response.data);
                // navigation.navigate('Login');
                navigation.navigate('LoginNav', {screen: 'Login'});
              } else {
                console.error('Error logging out', error);
              }
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleOK = async () => {
    // if (ipAddress) {
    //   setIsDialogVisible(false);
    //   dispatch(
    //     setCreden({
    //       ticket: null,
    //       URI: `http://${ipAddress}:1337`,
    //       WS_URI: `ws://${ipAddress}:1337`,
    //       RTMP_URI: `rtmp://${ipAddress}:1935/tv`,
    //     }),
    //   );
    // } else {
    //   Alert.alert('Error', 'IP address cannot be empty.');
    // }
    let response;
    const uid = await DeviceInfo.getAndroidId();
    try {
      // If the VIN number does not exist, perform a POST request to create a new entry
      response = await axios.post(creden.URI + `/hht_reg`, null, {
        params: {
          uid: uid,
        },
        headers: {
          Accept: 'application/json',
          // Authorization: "Bearer lemon",
        },
      });
      console.log('response data for registering HHT:', response.data);
      AsyncStorage.setItem('uid', uid);
    } catch (error) {
      // Handle the error response
      if (error.response && error.response.status === 403) {
        console.error(error.response.data.detail);
      } else {
        console.error('Error fetching data:', error);
      }
    } finally {
      setIsDialogVisible(false);
    }
  };

  useEffect(() => {
    const checkHTTRegistration = async () => {
      let response;
      const uid = await DeviceInfo.getAndroidId();
      try {
        response = await axios.get(creden.URI + `/hht/${uid}`, null, {
          headers: {
            Accept: 'application/json',
          },
        });
        console.log('response data for HTTRegistration:', response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error(error.response.data.detail);
          setIsDialogVisible(true);
        }
      }
    };
    checkHTTRegistration();
  }, []);

  // useEffect(() => {
  //   const shiftExist = async () => {
  //     const ticketNumber = await AsyncStorage.getItem('ticket');
  //     let response;
  //     try {
  //       response = await axios.get(creden.URI + `/current_users/`, null, {
  //         headers: {
  //           Accept: 'application/json',
  //         },
  //       });
  //       console.log('response data for current users:', response.data);
  //       // Get the data from the response
  //       const currentUsers = response.data;
  //       // Check if the ticket number is currently logged in
  //       if (!currentUsers.includes(ticketNumber)) {
  //         // If it doesn't exist, make the POST request
  //         // await axios.post(`${creden.URI}/login?ticket_no_in=${ticketNumber}`, null, {
  //         //     headers: {
  //         //         'Accept': 'application/json',
  //         //     },
  //         // });
  //         // console.log(`Logged in with ticket number: ${ticketNumber}`);
  //         setIsCurrentlyNotLogged(true);
  //       } else {
  //         console.log(`Ticket number ${ticketNumber} already logged in`);
  //       }
  //     } catch (error) {
  //       console.error('Error occurred in checking current users:', error);
  //     }
  //   };
  //   shiftExist();
  // }, []);

  const toLoginScreen = () => {
    dispatch(
      setCreden({
        ticket: null,
        zone: null,
        URI: creden.URI,
        WS_URI: creden.WS_URI,
        RTMP_URI: creden.RTMP_URI,
      }),
    );
    AsyncStorage.setItem('token', '');
    AsyncStorage.setItem('ticket', '');
    AsyncStorage.setItem('zone', '');
    AsyncStorage.setItem('isLoggedIn', '');
    // navigation.navigate('Login');
    setIsCurrentlyNotLogged(false);
    navigation.navigate('LoginNav', {screen: 'Login'});
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar />
      <TopTabs
        left={ham}
        center={logoApp}
        right={doc}
        tabLeftFunc={() => navigation.navigate('Profile')}
        tabRightFunc={() => navigation.navigate('AboutApp')}
      />

      <View style={styles.linearGradient}>
        <View
          style={{
            // width: 120,
            // height: 40,
            // top: -100,
            // borderRadius: 12,
            // borderWidth: 3,
            // borderColor: "#3758ff",
            alignSelf: 'flex-end',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2,
            // backgroundColor: '#3758ff',
            marginRight: s(10),
            flexDirection: 'row',
            bottom: vs(60),
          }}>
          <Text
            style={{
              fontSize: ms(17),
              color: '#7f7f7f',
              textAlign: 'center',
              // top: 10,
              marginRight: s(30),
            }}>
            Add new VC here →
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Amodel')}>
            <Image
              source={addVC}
              style={{
                resizeMode: 'contain',
                transform: 'scale(1.2)',
                // alignItems: 'center',
                right: s(10),
              }}
            />
          </TouchableOpacity>
        </View>
        <Image
          // source={logoTyre}
          source={chassis}
          style={{
            resizeMode: 'contain',
            // backgroundColor: "red",
            height: vs(160),
            bottom: vs(50),
            //   width: 80
          }}></Image>
        <View
          style={{
            width: s(160),
            height: vs(35),
            borderRadius: ms(30),
            // borderWidth: 3,
            // borderColor: "#31367b",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: '#0f113e',
            // backgroundColor: '#31367b',
            bottom: vs(30),
          }}>
          <Text
            style={{color: '#fff', fontSize: ms(17), letterSpacing: ms(1.5)}}>
            Step-1
          </Text>
        </View>
        <Text
          style={{
            fontSize: ms(17),
            color: '#7f7f7f',
            textAlign: 'center',
            bottom: vs(20),
          }}>
          Scan the barcodes of VIN and VC of a car
        </Text>
        <TouchableOpacity
          style={{
            width: s(170),
            height: vs(35),
            top: vs(10),
            borderRadius: ms(12),
            // borderWidth: 3,
            // borderColor: "#3758ff",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            // backgroundColor: '#3758ff',
            backgroundColor: 'darkgreen',
          }}
          onPress={() => navigation.navigate('VinCamera')}>
          {/* onPress={requestCameraPermission}> */}
          <Text style={styles.text}>Scan barcodes now</Text>
        </TouchableOpacity>

        {/* <Animated.Image
                entering={FadeInUp.delay(800).duration(2000).springify()}
                source={image}
                style={styles.image}
              ></Animated.Image> */}
        {/* <Animated.Image
                entering={FadeIn.delay(800).duration(2000).springify()}
                source={image}
                style={styles.image}
              ></Animated.Image> */}
        {/* <Animated.View
                style={styles.btn}
                entering={FadeInDown.duration(1000).springify()}
              > */}
        {/* <TouchableOpacity
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 30,
                    borderWidth: 3,
                    borderColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => navigation.navigate("Vmodel")}
                >
                  <Text style={styles.text}>GET STARTED</Text>
                </TouchableOpacity> */}
        {/* <TouchableOpacity
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 30,
                    borderWidth: 3,
                    borderColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => navigation.navigate("dummyapi")}
                >
                  <Text style={styles.text}>GET STARTED with api</Text>
                </TouchableOpacity> */}
        {/* </Animated.View> */}
        {/* <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={handleLogin}
                validationSchema={validationSchema}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <>
                    <Animated.View
                      entering={FadeInDown.delay(200).duration(1000).springify()}
                      style={styles.input1}
                    >
                      <TextInput
                        style={styles.ptext}
                        placeholder="Username or Email"
                        placeholderTextColor={"gray"}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                      />
                    </Animated.View>
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                    <Animated.View
                      entering={FadeInDown.delay(400).duration(1000).springify()}
                      style={styles.input2}
                    >
                      <TextInput
                        style={styles.ptext}
                        placeholder="Password"
                        placeholderTextColor={"gray"}
                        secureTextEntry
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                      />
                    </Animated.View>
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                    <Animated.View
                      entering={FadeInDown.delay(600).duration(1000).springify()}
                      style={styles.loginView}
                    >
                      <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => handleLogin(values)}
                      >
                        <Text style={styles.logInText}>Login</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </>
                )}
              </Formik>
      
              <Animated.View
                entering={FadeInDown.delay(700).duration(1000).springify()}
                style={{ flexDirection: "row", marginTop: 12 }}
              >
                <Text>Don't have an account? </Text>
                <TouchableOpacity>
                  <Text
                    style={{
                      // color: "#7ad7f0",
                      color: "rgba(255,140,97,1)",
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                    }}
                  >
                    SignUp
                  </Text>
                </TouchableOpacity>
              </Animated.View> */}
      </View>
      <Tabs
        left={dash}
        center={logoKGP2}
        right={logout}
        tabRightFunc={handleLogout}
        tabLeftFunc={() => navigation.navigate('Dashboard')}
      />
      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>New HTT registered.</Dialog.Title>
        <Dialog.Button label="OK" onPress={handleOK} />
      </Dialog.Container>
      <Dialog.Container visible={isCurrentlyNotLogged}>
        <Dialog.Title>Your shift has ended.</Dialog.Title>
        <Dialog.Description>
          Please log in again to continue.
        </Dialog.Description>
        <Dialog.Button label="OK" onPress={toLoginScreen} />
      </Dialog.Container>
    </SafeAreaView>
  );
};

export default ScanVIN;

const styles = ScaledSheet.create({
  safeContainer: {
    flex: 1,
    // backgroundColor: '#ffc0c8',
    // backgroundColor: "#ffe9ec",
    backgroundColor: '#fff',
  },

  linearGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 5,
    // height: 100,
    // width: 350,
  },
  imageBackground: {
    flex: 1,
    // backgroundColor:"red",
    // resizeMode: "cover",
    width: '100%',
    height: '55%',
    alignItems: 'center',
    // justifyContent: "center",
  },

  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '17@ms',
    letterSpacing: '0.4@ms',
    // flex:1,
  },
});
