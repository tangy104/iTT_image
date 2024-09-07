import {
  View,
  Text,
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
import axios from 'axios';
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

import {s, vs, ms, mvs, ScaledSheet} from 'react-native-size-matters';

const StackHome = ({navigation}) => {
  const [ipAddress, setIpAddress] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const dispatch = useDispatch();
  const creden = useSelector(state => state.creden.creden);
  console.log('creden', creden);

  const checkip = async () => {
    const ip = await AsyncStorage.getItem('ip');
    console.log('ip inside', ip);

    if (ip != null || ip != undefined) {
      console.log('ip', ip);
      try {
        const response = await axios.get(`http://${ip}:1337`, {
          timeout: 1000, // 1 second timeout
        });
        console.log('response', response.data.message);
        if (response.data.message === 'Connection successful!') {
          dispatch(
            setCreden({
              ticket: null,
              zone: null,
              URI: `http://${ip}:1337`,
              WS_URI: `ws://${ip}:1337`,
              RTMP_URI: `rtmp://${ip}:1935/tv`,
            }),
          );
          console.log('done setting ip');
        }
      } catch (error) {
        console.log('error', error);
        setIsDialogVisible(true);
      }
    } else {
      setIsDialogVisible(true);
      console.log('ip is null');
    }
  };

  useEffect(() => {
    checkip();
    console.log('check initiated');
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

  const handleOK = async () => {
    if (ipAddress) {
      try {
        const response = await axios.get(`http://${ipAddress}:1337`, {
          timeout: 1000, // 1 second timeout
        });
        console.log('response', response.data.message);
        if (response.data.message === 'Connection successful!') {
          setIsDialogVisible(false);
          AsyncStorage.setItem('ip', ipAddress);
          dispatch(
            setCreden({
              ticket: null,
              zone: null,
              URI: `http://${ipAddress}:1337`,
              WS_URI: `ws://${ipAddress}:1337`,
              RTMP_URI: `rtmp://${ipAddress}:1935/tv`,
            }),
          );
        }
      } catch (error) {
        Alert.alert(
          'Invalid IP address.',
          'Check server or network connection and try again.',
        );
      }
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
          <Image source={logoTATA} style={styles.logoTATA} />
          <Text style={styles.text1}>TATA MOTORS LTD.</Text>
          <Image source={logoApp} style={styles.logoApp} />
          <Image source={iTTText} style={styles.iTTText} />
          <Image source={welcomeText} style={styles.welcomeText} />
          <Text style={styles.subText}>
            AI-based Tyre Specification Reading and Downstream Analytics
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              width: '90%',
              // backgroundColor: 'red',
              marginTop: vs(25),
            }}>
            <TouchableOpacity
              style={styles.changeIpButton}
              onPress={() => {
                setIsDialogVisible(true);
              }}>
              <Text style={styles.changeIpButtonText}>Change IP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text style={styles.text}>Get started</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.developedByView}>
            <Text style={styles.developedByText}>Developed by:</Text>
          </View>
          <View style={styles.developedByInfoView}>
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
        <Dialog.Button label="OK" onPress={handleOK} />
      </Dialog.Container>
    </SafeAreaView>
  );
};

export default StackHome;

const styles = ScaledSheet.create({
  safeContainer: {
    flex: 1,
  },
  changeIpButton: {
    // position: 'absolute',
    display: 'flex',
    // flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10@s',
    zIndex: 1,
    color: 'white',
    height: '32@vs',
    width: '140@s',
    // right: '25@s',
    // top: '30@vs',
    backgroundColor: '#181a63',
  },
  changeIpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16@ms',
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
  logoTATA: {
    resizeMode: 'contain',
    width: '250@s',
    height: '55@vs',
    marginTop: '35@vs',
  },
  text1: {
    color: '#fff',
    fontSize: '20@s',
    fontWeight: 'bold',
    marginTop: '10@vs',
    letterSpacing: '1.5@s',
  },
  logoApp: {
    resizeMode: 'contain',
    width: '90@s',
    height: '90@vs',
    // marginTop: '10@vs',
  },
  iTTText: {
    resizeMode: 'contain',
    width: '250@s',
    height: '55@vs',
    // marginTop: '15@vs',
  },
  welcomeText: {
    resizeMode: 'contain',
    width: '250@s',
    height: '55@vs',
    marginTop: '5@vs',
  },
  subText: {
    color: '#aaaaaa',
    fontSize: '14@s',
    // fontWeight: 'bold',
    // marginTop: '5@vs',
    textAlign: 'center',
  },
  getStartedButton: {
    // flex:1,
    // marginTop: '45@vs',
    borderRadius: '9@s',
    backgroundColor: '#006401',
    height: '32@vs',
    width: '140@s',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: '18@s',
    fontWeight: 'bold',
  },
  developedByView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'pink',
    letterSpacing: '1@s',
    marginTop: '14@vs',
  },
  developedByText: {
    color: '#000',
    fontSize: '14@s',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  developedByInfoView: {
    // flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: '20@vs',
    // backgroundColor: 'red',
    marginTop: '10@vs',
  },
  developedByTextView: {
    alignItems: 'center',
  },
  developedByTextLines: {
    color: '#000',
    fontSize: '12@s',
    textAlign: 'center',
    // fontWeight: 'bold',
  },
});
