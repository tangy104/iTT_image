import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  BackHandler,
} from 'react-native';
import {Dropdown, SelectCountry} from 'react-native-element-dropdown';
import {s, vs, ms, ScaledSheet} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {setTokenGlobal} from '../../state/tokenslice';
import {setCreden} from '../../state/credenSlice';
import {URI} from '@env';

import Tabs from '../../navigation/Tabs';

// Import images
import backgroundImage from '../../utils/images/backgroundImage.png';
import backgroundImage2 from '../../utils/images/backgroundImage2.png';
import logoTATA from '../../utils/images/logoTATA.png';
import logoApp from '../../utils/images/logoApp.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import logoKGP3 from '../../utils/images/logoKGP3.png';
import id from '../../utils/images/id.png';
import doc from '../../utils/images/doc.png';
import question from '../../utils/images/question.png';
import admin from '../../utils/images/admin.png';
import iTTText from '../../utils/images/iTTText.png';

const Login = ({navigation, route}) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const data = [
    {label: 'Rear', value: 'Rear'},
    {label: 'Front', value: 'Front'},
    // Add more options as needed
  ];

  const [ticketNo, setTicketNo] = useState('');
  // const [adminTicketNo, setAdminTicketNo] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const creden = useSelector(state => state.creden.creden);
  const globalToken = useSelector(state => state.token.tokenGlobal);

  console.log('uri', URI);
  // console.log('uri_new-', creden.URI);
  // console.log('ws_uri-', creden.WS_URI);

  const handleBackPress = () => {
    // e.preventDefault();
    navigation.replace('LogInHome');
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

  const handleAdminLogin = async () => {
    if (password === '') {
      alert('Please enter the Passkey');
      return;
    } else if (password === 'tangylemon') {
      setShowAdminModal(false);
      navigation.navigate('AdminScreen', {
        password: password,
      });
      setPassword('');
    } else {
      alert('Invalid Passkey. Please try again.');
    }
    // try {
    //   const response = await axios.post(`${URI}/admin/login`, {
    //     ticketNo,
    //     password,
    //   });

    //   // Handle admin login response
    //   console.log("Admin login successful:", response.data);
    //   // Close the modal
    //   setShowAdminModal(false);
    // } catch (error) {
    //   console.error("Error logging in as admin:", error.message);
    //   // Handle error, e.g., show error message to the user
    // }
  };

  const handlePostData = async () => {
    console.log('zone:', selectedZone);
    try {
      if (!ticketNo) {
        alert('Please enter Ticket no.');
        return;
      }
      if (selectedZone === null) {
        alert('Please select a zone');
        return;
      }

      const response = await axios.post(creden.URI + '/login/', null, {
        params: {
          ticket_no_in: ticketNo,
        },
        headers: {
          Accept: 'application/json',
        },
      });

      const token = response.data.access_token;
      dispatch(setTokenGlobal(token));
      dispatch(
        setCreden({
          ticket: ticketNo,
          zone: selectedZone,
          URI: creden.URI,
          WS_URI: creden.WS_URI,
          RTMP_URI: creden.RTMP_URI,
        }),
      );
      AsyncStorage.setItem('token', token);
      AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
      AsyncStorage.setItem('ticket', ticketNo);
      AsyncStorage.setItem('zone', selectedZone);

      //   console.log('Login successful! token:', token); //look into this as they give different values
      console.log('Login successful! token:', globalToken);

      // navigation.navigate('ScanVIN');
      navigation.replace('StackNav', {screen: 'ScanVIN'});
      setTicketNo('');
    } catch (error) {
      console.error('Error during login:', error.message);
      // console.error("Error during login:", error.response.status);
      if (error.response && error.response.status === 401) {
        alert('Invalid Ticket no. Please try again.');
      } else if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.detail === 'Ticket no. already logged in.'
      ) {
        alert('Ticket no already logged in. Please enter correct ticket no.');
      } else if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.detail === 'Unregistered ticket no..'
      ) {
        alert('Unauthorized ticket no. Please contact admin for access.');
      } else {
        alert('Error during login. Please try again.');
      }
    }
  };

  const BottomTabLeftFunc = () => {
    navigation.navigate('AboutCoEAMT');
  };
  const BottomTabRightFunc = () => {
    navigation.navigate('AboutApp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <ImageBackground
            source={backgroundImage2}
            style={[
              styles.backgroundImage,
              {height: keyboardVisible ? '92%' : '77%'},
              {top: keyboardVisible ? vs(-10) : vs(0)},
            ]}>
            <View
              style={[
                styles.logoContainer,
                {top: keyboardVisible ? vs(20) : vs(0)},
              ]}>
              <View style={{flexDirection: 'row'}}>
                <Image source={logoTATA} style={styles.logoTATA} />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    left: '40%',
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => setShowAdminModal(true)}>
                  <Image
                    source={admin}
                    style={{
                      resizeMode: 'contain',
                      width: s(80),
                      height: vs(40),
                    }}
                  />
                </TouchableOpacity>
              </View>

              {/* <Text style={styles.logoText}>TATA MOTORS LTD.</Text> */}
              <Image source={logoApp} style={styles.logoApp} />
              {/* <Text style={styles.subtitleText}>Intelligent Tyre Tracer</Text> */}
              {/* <Text style={styles.welcomeText}>Welcome to iTT</Text> */}
              {/* <Text style={styles.infoText}>
                AI-based Tyre Specification Reading and Downstream Analytics
              </Text> */}
              <Image
                source={iTTText}
                style={{resizeMode: 'contain', width: s(240), top: vs(30)}}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image
                source={id}
                style={{resizeMode: 'contain', height: vs(25), width: s(24)}}
              />
              <TextInput
                placeholder="Ticket no."
                placeholderTextColor="grey"
                style={styles.input}
                value={ticketNo}
                onChangeText={text => setTicketNo(text)}
              />
            </View>
            <View
              style={{
                // flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // padding: 16,
                // backgroundColor: 'red',
                width: s(220),
                top: vs(40),
              }}>
              <Dropdown
                style={{
                  height: vs(36),
                  width: s(198),
                  borderColor: '#0f113e',
                  borderWidth: 1.5,
                  borderRadius: ms(10),
                  paddingHorizontal: s(10),
                  backgroundColor: !selectedZone
                    ? 'white'
                    : selectedZone === 'Rear'
                    ? '#9caf88'
                    : '#0c4767',
                }}
                containerStyle={{
                  color: 'black',
                  borderRadius: ms(12),
                  marginTop: vs(5),
                  // backgroundColor: 'red',
                  paddingVertical: vs(3),
                }}
                itemContainerStyle={{
                  borderBottom: 'black',
                  borderRadius: ms(12),
                }}
                itemTextStyle={{color: 'black'}}
                placeholderStyle={{color: 'gray'}}
                selectedTextStyle={{color: 'white'}}
                // activeColor="green"
                data={data}
                labelField="label"
                valueField="value"
                placeholder="Select zone"
                value={selectedZone}
                onChange={item => setSelectedZone(item.value)}
                renderItem={({label, value}) => (
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      // alignItems: 'center',
                      // paddingTop: label === 'Rear' ? 10 : 5,
                      // paddingBottom: label === 'Rear' ? 5 : 15,
                      paddingVertical: vs(10),
                      height: vs(40),
                      paddingHorizontal: s(10),
                      borderRadius: ms(12),
                      backgroundColor: label === 'Rear' ? '#9caf88' : '#0c4767',
                      marginVertical: vs(3),
                      marginHorizontal: s(5),
                    }}>
                    <Text style={{fontSize: ms(16), color: 'white'}}>
                      {label}
                    </Text>
                    {/* <View
                      style={{
                        height: 0.5,
                        backgroundColor: '#0f113e',
                        // marginTop: 10,
                      }}
                    /> */}
                  </View>
                )}
              />
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handlePostData}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
      {!keyboardVisible && (
        <Tabs
          // style={{position: "absolute", bottom: 0}}
          // left={doc}
          center={logoKGP2}
          right={doc}
          // tabLeftFunc={BottomTabLeftFunc}
          // tabRightFunc={BottomTabLeftFunc}
        />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAdminModal}
        onRequestClose={() => setShowAdminModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Admin Login</Text>
            <Text style={{color: 'black'}}>Please enter the Admin Passkey</Text>

            <View
              style={{
                margin: s(20),
                marginTop: vs(15),
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: s(190),
                height: vs(35),
                // top: 160,
                borderRadius: ms(12),
                borderWidth: 1.5,
                borderColor: '#3758ff',
                //   justifyContent: "center",
                alignItems: 'center',
                //   zIndex: 2,
                //   backgroundColor: "red",
              }}>
              <Image
                source={id}
                style={{
                  resizeMode: 'contain',
                  height: vs(25),
                  width: s(25),
                }}></Image>
              <View>
                <TextInput
                  placeholder="Passkey"
                  placeholderTextColor="grey"
                  style={{height: vs(40), width: s(150), color: 'black'}}
                  secureTextEntry
                  value={password}
                  onChangeText={text => setPassword(text)}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: s(170),
                height: vs(35),
                // top: 160,
                borderRadius: ms(12),
                // borderWidth: 3,
                // borderColor: "#3758ff",
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                backgroundColor: '#3758ff',
              }}
              onPress={handleAdminLogin}>
              <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    // justifyContent: "center",
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: '40@vs',
    // backgroundColor: 'red',
    marginTop: '25@vs',
  },
  // style={{resizeMode: 'contain', width: 140, height: 120, top: 75}}
  logoTATA: {
    resizeMode: 'contain',
    width: '95@s',
    height: '55@vs',
    alignSelf: 'center',
    // justifyContent: "center",
    // left:"75%"
  },
  logoText: {
    color: '#d9d9d9',
    fontSize: '20@ms',
    fontWeight: 'bold',
    letterSpacing: '3@ms',
    marginBottom: '10@vs',
  },
  logoApp: {
    resizeMode: 'contain',
    width: '100@s',
    height: '100@vs',
    top: '50@vs',
  },
  subtitleText: {
    color: '#fff',
    fontSize: '20@ms',
    fontFamily: 'Allura_400Regular',
    fontStyle: 'italic',
    marginBottom: '10@vs',
  },
  inputContainer: {
    width: '196@s',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '20@vs',
    borderWidth: 1.5,
    borderColor: '#3758ff',
    borderColor: '#0f113e',
    borderRadius: '12@ms',
    paddingHorizontal: '10@s',
    backgroundColor: 'white',
    top: '50@vs',
    // backgroundColor:"red"
  },
  input: {
    flex: 1,
    height: '40@vs',
    // top: '10@vs',
    paddingHorizontal: '6@s',
    color: 'black',
    backgroundColor: 'red',
  },
  loginButton: {
    width: '196@s',
    height: '35@vs',
    borderRadius: '12@ms',
    // backgroundColor: '#3758ff',
    backgroundColor: 'darkgreen',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50@vs',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '17@ms',
    letterSpacing: '1@ms',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20@s',
    borderRadius: '10@ms',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',

    minHeight: '260@vs',
    height: '35%',
  },
  modalTitle: {
    fontSize: '18@ms',
    fontWeight: 'bold',
    marginBottom: '10@vs',
    color: 'black',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: '5@ms',
    padding: '10@s',
    marginBottom: '10@vs',
    width: '95%',
  },

  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '17@ms',
    letterSpacing: '1@ms',
    // flex:1,
  },
});
