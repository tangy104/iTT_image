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
} from 'react-native';
import React, {useState} from 'react';
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
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {setTokenGlobal} from '../../state/tokenslice';
import {setCreden} from '../../state/credenSlice';

import Tabs from '../../navigation/Tabs';
import TopTabs from '../../navigation/TopTabs';

import image from '../../utils/images/light.png';
import backgroundImage from '../../utils/images/backgroundImage.png';
import logoTATA from '../../utils/images/logoTATA.png';
import logoApp from '../../utils/images/logoApp.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import id from '../../utils/images/id.png';
import dash from '../../utils/images/dash.png';
import logout from '../../utils/images/logout.png';
import logoTyre from '../../utils/images/logoTyre.png';
import question from '../../utils/images/question.png';
import ham from '../../utils/images/ham.png';

// import GoodVibes from "../../../assets/fonts/GreatVibes-Regular.ttf";
import {URI} from '@env';

// const windowWidth = useWindowDimensions().width;

// const validationSchema = Yup.object().shape({
//   // email: Yup.string().email("Invalid email").required("Email is required"),
//   email: Yup.string().required('Email is required'),
//   password: Yup.string().required('Password is required'),
// });

const Home = ({navigation}) => {
  //   const [fontsLoaded] = useFonts({
  //     allura,
  //     Allura_400Regular,
  //   });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  const dispatch = useDispatch();
  const globalToken = useSelector(state => state.token.tokenGlobal);
  const creden = useSelector(state => state.creden.creden);

  console.log('uri_new-', creden.URI);
  console.log('ws_uri-', creden.WS_URI);
  console.log('ticket-', creden.ticket);

  console.log('URI:', URI);

  //posting by axios
  const handleLogin = async values => {
    try {
      // Check if email and password are provided
      if (!values.email || !values.password) {
        // Show an alert if either email or password is missing
        alert('Please enter both email and password.');
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
        alert('Invalid username or password. Please try again.');
      } else {
        // Handle other types of errors as needed
        alert('Invalid credentials. Please try again.');
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

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar />
      <TopTabs
        left={ham}
        center={logoApp}
        right={question}
        tabLeftFunc={() => navigation.navigate('Profile')}
        tabRightFunc={() => navigation.navigate('AboutApp')}
      />

      <View style={styles.linearGradient}>
        <TouchableOpacity
          style={{
            width: 220,
            height: 40,
            top: -100,
            borderRadius: 12,
            // borderWidth: 3,
            // borderColor: "#3758ff",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: '#3758ff',
          }}
          onPress={() => navigation.navigate('Amodel')}>
          <Text style={styles.text}>Add new VC</Text>
        </TouchableOpacity>
        <Image
          source={logoTyre}
          style={{
            resizeMode: 'contain',
            // backgroundColor: "red",
            height: 160,
            bottom: 60,
            //   width: 80
          }}></Image>
        <View
          style={{
            width: 180,
            height: 38,
            // borderRadius: 30,
            // borderWidth: 3,
            // borderColor: "#31367b",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: '#31367b',
          }}>
          <Text style={{color: '#fff', fontSize: 17, letterSpacing: 1.5}}>
            Step-1
          </Text>
        </View>
        <Text
          style={{
            fontSize: 17,
            color: '#7f7f7f',
            textAlign: 'center',
            top: 10,
          }}>
          Scan the barcodes of VIN and VC of a car
        </Text>
        <TouchableOpacity
          style={{
            width: 220,
            height: 40,
            top: 70,
            borderRadius: 12,
            // borderWidth: 3,
            // borderColor: "#3758ff",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: '#3758ff',
          }}
          onPress={() => navigation.navigate('VinCamera')}>
          {/* onPress={requestCameraPermission}> */}
          <Text style={styles.text}>Scan new VIN</Text>
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
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    // backgroundColor: "#ffc0c8",
    // backgroundColor: "#ffe9ec",
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
  text1: {
    // position: "absolute",
    top: 70,
    color: '#d9d9d9',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 3,
    // flex:1,
  },
  text2: {
    // position: "absolute",
    top: 60,
    // left: 22,
    color: '#fff',
    fontSize: 20,
    // fontWeight: "bold",
    // fontFamily: 'Allura_400Regular',
    fontStyle: 'italic',
    // flex:1,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
    // flex:1,
  },
  btn: {
    position: 'absolute',
    // top: 360,
    // left: 135,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 3,
    borderRadius: 30,
    // borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "rgba(0, 0, 0, 0.1)",
    height: 50,
    width: 120,
    // margin: 100,
    // flex:1
  },
  image: {
    position: 'absolute',
    paddingRight: 5,
    top: 0,
    left: '75%',
    height: 200,
    // height: "30%",
    width: 80,
    // width: "20%",
  },
  input1: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 300,
    width: '90%',
    height: 30,
    borderRadius: 20,
  },
  input2: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 20,
    width: '90%',
    height: 30,
    borderRadius: 20,
  },
  loginView: {
    backgroundColor: '#3758ff',
    // backgroundColor: "rgba(255,140,97,1)",
    marginTop: 20,
    width: '90%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  loginBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  ptext: {
    margin: 0,
    paddingLeft: 15,
  },
  logInText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
  },
});
