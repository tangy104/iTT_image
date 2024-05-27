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
} from 'react-native';
import React, {useState, useEffect} from 'react';
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

import Tabs from '../../navigation/Tabs';

import image from '../../utils/images/light.png';
import backgroundImage from '../../utils/images/backgroundImage.png';
import logoTATA from '../../utils/images/logoTATA.png';
import logoApp from '../../utils/images/logoApp.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import Profile from '../../utils/images/profile.png';
import doc from '../../utils/images/doc.png';
import question from '../../utils/images/question.png';
import back from '../../utils/images/back.png';
import profileEdit from '../../utils/images/profileEdit.png';
import logoTATA2 from '../../utils/images/logoTATA2.png';
import pencil from '../../utils/images/pencil.png';

// import GoodVibes from "../../../assets/fonts/GreatVibes-Regular.ttf";
import {URI} from '@env';

// const windowWidth = useWindowDimensions().width;

// const validationSchema = Yup.object().shape({
//   // email: Yup.string().email("Invalid email").required("Email is required"),
//   email: Yup.string().required('Email is required'),
//   password: Yup.string().required('Password is required'),
// });

const Home = ({navigation}) => {
  const [data, setData] = useState(null);

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

  const endpoint = creden.URI + '/whoami/';

  // Function to make the POST request
  const makeRequest = async () => {
    try {
      const response = await axios.post(
        endpoint,
        {},
        {
          params: {
            token: globalToken,
          },
          headers: {
            Accept: 'application/json',
            // Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Response:', response.data);
      setData(response.data);
      console.log('Data:', data);
      // console.log("photo path:", `${URI + data.photo_path}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    // Call the function to make the request
    makeRequest();
  }, []);
  const BottomTabLeftFunc = () => {
    navigation.navigate('AboutCoEAMT');
  };
  const BottomTabRightFunc = () => {
    navigation.navigate('AboutApp');
  };
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar />

      <View style={styles.linearGradient}>
        <ImageBackground
          source={backgroundImage}
          style={styles.imageBackground}>
          <View
            style={{
              // flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 100,
              width: '100%',
              // backgroundColor: "#31367b",
              // backgroundColor: "red",
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            }}>
            <TouchableOpacity
              style={{
                width: '33%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => navigation.goBack()}>
              <Image
                source={back}
                style={{resizeMode: 'contain', width: 26, height: 27}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '33%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              // onPress={() => navigation.navigate("Profile")}
              //   onPress={() => navigation.navigate('Login')}
            >
              <Image
                source={logoApp}
                style={{
                  resizeMode: 'contain',
                  width: 100,
                  height: 90,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '33%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('AboutApp')}>
              <Image source={question} style={{width: 25, height: 23}} />
            </TouchableOpacity>
          </View>

          {/* <Animated.Text
            entering={FadeInUp.delay(200).duration(1000).springify()}
            style={styles.text1}>
            User profile
          </Animated.Text> */}
          <Text style={styles.text1}> User profile</Text>
          <View
            style={{
              height: 150,
              width: 150,
              borderRadius: 100,
              borderWidth: 3,
              borderColor: '#d9d9d9',
              top: 95,
              backgroundColor: '#3758ff',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{position: 'absolute', left: 120, top: 10}}>
              <Image source={pencil} />
            </TouchableOpacity>

            <Image
              source={
                data && data.photo_path
                  ? {uri: `${creden.URI + data.photo_path}`}
                  : profileEdit
              }
              style={{
                resizeMode: 'cover',
                flex: data && data.photo_path ? 1 : 0,
                zIndex: -1,
                borderRadius: 100,
                width: data && data.photo_path ? 144 : 80,
                height: data && data.photo_path ? 144 : 80,
              }}
            />
          </View>

          {/* <Animated.Text
              entering={FadeInUp.delay(400).duration(1000).springify()}
              style={styles.text2}
            >
              Intelligent Tyre Tracer
            </Animated.Text> */}
          {/* <Text style={{ fontFamily: "Allura_400Regular", fontSize: 25, color: "#fff" }}> */}

          <Text style={{fontSize: 30, top: 120, color: 'black'}}>
            {data && data.first_name && data.last_name
              ? data.first_name + ' ' + data.last_name
              : 'Username not available'}
          </Text>
          <View
            style={{
              top: 150,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  letterSpacing: 0.8,
                  color: '#31367b',
                  fontWeight: 'bold',
                }}>
                Email:
              </Text>
              <Text style={{fontSize: 17, color: '#7f7f7f'}}>
                {' '}
                {data && data.email ? data.email : 'Email not available'}
              </Text>
            </View>
            <View
              style={{
                top: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  letterSpacing: 0.8,
                  color: '#31367b',
                  fontWeight: 'bold',
                }}>
                Ticket no.:
              </Text>
              <Text style={{fontSize: 17, color: '#7f7f7f'}}>
                {' '}
                {data ? data.ticket_no : ''}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
      <Tabs
        left={doc}
        center={logoTATA2}
        right={question}
        tabLeftFunc={BottomTabLeftFunc}
        tabRightFunc={BottomTabRightFunc}
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
    fontFamily: 'Allura_400Regular',
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
