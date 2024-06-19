import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ImageBackground,
  Alert,
  Keyboard,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {setCreden} from '../../state/credenSlice';

import Tabs from '../../navigation/Tabs';

import backgroundImage from '../../utils/images/backgroundImage.png';
import backgroundImage2 from '../../utils/images/backgroundImage2.png';
import logoTATA from '../../utils/images/logoTATA.png';
import logoApp from '../../utils/images/logoApp.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import logoKGP3 from '../../utils/images/logoKGP3.png';
import Profile from '../../utils/images/profile.png';
import doc from '../../utils/images/doc.png';
import question from '../../utils/images/question.png';
import iTTText from '../../utils/images/iTTText.png';
import welcomeText from '../../utils/images/welcomeText.png';

const StackHome = ({navigation}) => {
  const [ipAddress, setIpAddress] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dispatch = useDispatch();
  const creden = useSelector(state => state.creden.creden);
  console.log('creden', creden);

  const checkLogin = async () => {
    const data = await AsyncStorage.getItem('isLoggedIn');
    console.log('at main home', data);
    // setIsLoggedIn(data === 'true');
    setIsLoggedIn(data);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
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

  useEffect(() => {
    setIsDialogVisible(true);
  }, []);

  const handleCancel = () => {
    setIsDialogVisible(false);
  };

  const handleOK = () => {
    if (ipAddress) {
      setIsDialogVisible(false);
      dispatch(
        setCreden({
          ticket: null,
          URI: `http://${ipAddress}:1337`,
          WS_URI: `ws://${ipAddress}:1337`,
          RTMP_URI: `rtmp://${ipAddress}:1935/tv`,
        }),
      );
    } else {
      Alert.alert('Error', 'IP address cannot be empty.');
    }
  };

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
          source={backgroundImage2}
          style={styles.imageBackground}>
          <Image
            source={logoTATA}
            style={{resizeMode: 'contain', width: 95, height: 65, top: 30}}
          />
          <Text style={styles.text1}>TATA MOTORS LTD.</Text>
          <Image
            source={logoApp}
            style={{resizeMode: 'contain', width: 140, height: 120, top: 75}}
          />
          {/* <Text style={styles.text2}>intelligent Tyre Tracer</Text> */}
          <Image
            source={iTTText}
            style={{resizeMode: 'contain', width: 250, top: 40}}
          />
          {/* <Text style={{fontSize: 29, top: 120, color: 'black'}}>
            Welcome to
            <Text style={{fontStyle: 'italic'}}>&nbsp;i&nbsp;</Text>
            TT
          </Text> */}
          <Image
            source={welcomeText}
            style={{resizeMode: 'contain', width: 250, top: 75}}
          />
          <Text
            style={{
              fontSize: 17,
              color: '#7f7f7f',
              textAlign: 'center',
              top: 60,
            }}>
            AI-based Tyre Specification Reading and Downstream Analytics
          </Text>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => {
              // isLoggedIn
              navigation.navigate('Login');
              // : navigation.navigate('Login');
            }}>
            <Text style={styles.text}>Get started</Text>
          </TouchableOpacity>
          <View style={styles.developedByView}>
            <Text style={styles.developedByText}>Developed by:</Text>
          </View>
          <View style={styles.developedByInfoView}>
            {/* <Image source={logoKGP2} style={styles.logoKGP2} /> */}
            <View style={styles.developedByTextView}>
              <Text style={styles.developedByTextLines}>
                Centre of Excellence in
              </Text>
              <Text style={styles.developedByTextLines}>
                Advanced Manufacturing Technology
              </Text>
              <Text style={styles.developedByTextLines}>IIT Kharagpur</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
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
      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>Enter Server IP Address</Dialog.Title>
        <Dialog.Input
          placeholder="Enter IP address(eg-192.168.116.171)"
          onChangeText={text => setIpAddress(text)}
          value={ipAddress}
          keyboardType="decimal-pad"
        />
        {/* <Dialog.Button label="Cancel" onPress={handleCancel} /> */}
        <Dialog.Button label="OK" onPress={handleOK} />
      </Dialog.Container>
    </SafeAreaView>
  );
};

export default StackHome;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '60%',
    alignItems: 'center',
  },

  text1: {
    top: 30,
    color: '#d9d9d9',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  text2: {
    top: 60,
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Allura_400Regular',
    fontStyle: 'italic',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  getStartedButton: {
    width: 180,
    height: 40,
    top: 90,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#31367b',
    // backgroundColor: '#234f1e',
    backgroundColor: 'darkgreen',
    borderRadius: 10,
  },
  developedByView: {
    top: 135,
    // alignSelf: 'flex-start',
    height: 35,
    width: 150,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  developedByText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.8,
    textDecorationLine: 'underline',
  },
  developedByInfoView: {
    top: 130,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'flex-start',
    // backgroundColor: 'red',
    paddingLeft: 10,
  },
  logoKGP2: {
    right: 20,
    resizeMode: 'contain',
    width: 60,
    height: 60,
  },
  developedByTextView: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  developedByTextLines: {
    fontSize: 16.5,
    color: 'black',
  },
});
