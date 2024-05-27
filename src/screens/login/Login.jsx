import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {setTokenGlobal} from '../../state/tokenslice';
import {setCreden} from '../../state/credenSlice';
import {URI} from '@env';

import Tabs from '../../navigation/Tabs';

// Import your images
import backgroundImage from '../../utils/images/backgroundImage.png';
import logoTATA from '../../utils/images/logoTATA.png';
import logoApp from '../../utils/images/logoApp.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import id from '../../utils/images/id.png';
import doc from '../../utils/images/doc.png';
import question from '../../utils/images/question.png';
import admin from '../../utils/images/admin.png';

const Login = ({navigation, route}) => {
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
    try {
      if (!ticketNo) {
        alert('Please enter Ticket no.');
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
          URI: creden.URI,
          WS_URI: creden.WS_URI,
          RTMP_URI: creden.RTMP_URI,
        }),
      );

      //   console.log('Login successful! token:', token); //look into this as they give different values
      console.log('Login successful! token:', globalToken);

      navigation.navigate('ScanVIN');
      setTicketNo('');
    } catch (error) {
      console.error('Error during login:', error.message);
      // console.error("Error during login:", error.response.status);
      if (error.response && error.response.status === 401) {
        alert('Invalid Ticket no. Please try again.');
      } else {
        alert('Invalid credentials. Please try again.');
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
            source={backgroundImage}
            style={[
              styles.backgroundImage,
              {height: keyboardVisible ? '85%' : '80%'},
            ]}>
            <View
              style={[styles.logoContainer, {top: keyboardVisible ? 20 : 0}]}>
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
                      width: 80,
                      height: 50,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.logoText}>TATA MOTORS LTD.</Text>
              <Image source={logoApp} style={styles.logoApp} />
              <Text style={styles.subtitleText}>Intelligent Tyre Tracer</Text>
              <Text style={styles.welcomeText}>Welcome to iTT</Text>
              <Text style={styles.infoText}>
                AI-based Tyre Specification Reading and Downstream Analytics
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Image
                source={id}
                style={{resizeMode: 'contain', height: 30, width: 30}}
              />
              <TextInput
                placeholder="Ticket no."
                placeholderTextColor="grey"
                style={styles.input}
                value={ticketNo}
                onChangeText={text => setTicketNo(text)}
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
          left={doc}
          center={logoKGP2}
          right={question}
          tabLeftFunc={BottomTabLeftFunc}
          tabRightFunc={BottomTabRightFunc}
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

            {/* <View
              style={{
                margin: 20,
                marginBottom: 5,
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: 220,
                height: 40,
                // top: 160,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: "#3758ff",
                //   justifyContent: "center",
                alignItems: "center",
                //   zIndex: 2,
                //   backgroundColor: "red",
              }}
              // onPress={() => navigation.navigate("Vmodel")}
            >
              <Image
                source={id}
                style={{ resizeMode: "contain", height: 30, width: 30 }}
              ></Image>
              <View>
                <TextInput
                  placeholder="Ticket no."
                  placeholderTextColor=""
                  style={{ height: 40, width: 180 }}
                  value={adminTicketNo}
                  onChangeText={(text) => setAdminTicketNo(text)}
                />
              </View>
            </View> */}
            <View
              style={{
                margin: 20,
                marginTop: 15,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: 220,
                height: 40,
                // top: 160,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#3758ff',
                //   justifyContent: "center",
                alignItems: 'center',
                //   zIndex: 2,
                //   backgroundColor: "red",
              }}>
              <Image
                source={id}
                style={{resizeMode: 'contain', height: 30, width: 30}}></Image>
              <View>
                <TextInput
                  placeholder="Passkey"
                  placeholderTextColor="grey"
                  style={{height: 40, width: 180, color: 'black'}}
                  secureTextEntry
                  value={password}
                  onChangeText={text => setPassword(text)}
                />
              </View>
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

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoTATA: {
    resizeMode: 'contain',
    width: 80,
    height: 50,
    alignSelf: 'center',
    // justifyContent: "center",
    // left:"75%"
  },
  logoText: {
    color: '#d9d9d9',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 10,
  },
  logoApp: {
    resizeMode: 'contain',
    width: 140,
    height: 120,
  },
  subtitleText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Allura_400Regular',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 17,
    color: '#7f7f7f',
    textAlign: 'center',
    marginBottom: 20,
    top: 65,
  },
  inputContainer: {
    width: 220,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#3758ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    top: 40,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: 'black',
  },
  loginButton: {
    width: 220,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#3758ff',
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',

    minHeight: 260,
    height: '35%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '95%',
  },

  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
    // flex:1,
  },
});
