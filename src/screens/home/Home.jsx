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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Dialog from 'react-native-dialog';
import {useSelector, useDispatch} from 'react-redux';
import {setCreden} from '../../state/credenSlice';

import Tabs from '../../navigation/Tabs';

import backgroundImage from '../../utils/images/backgroundImage.png';
import logoTATA from '../../utils/images/logoTATA.png';
import logoApp from '../../utils/images/logoApp.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import Profile from '../../utils/images/profile.png';
import doc from '../../utils/images/doc.png';
import question from '../../utils/images/question.png';

const Home = ({navigation}) => {
  const [ipAddress, setIpAddress] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const dispatch = useDispatch();
  const creden = useSelector(state => state.creden.creden);
  console.log('creden', creden);

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
          source={backgroundImage}
          style={styles.imageBackground}>
          <Image
            source={logoTATA}
            style={{resizeMode: 'contain', width: 80, height: 50, top: 60}}
          />
          <Text style={styles.text1}>TATA MOTORS LTD.</Text>
          <Image
            source={logoApp}
            style={{resizeMode: 'contain', width: 140, height: 120, top: 75}}
          />
          <Text style={styles.text2}>Intelligent Tyre Tracer</Text>
          <Text style={{fontSize: 30, top: 120, color: 'black'}}>
            Welcome to
            <Text style={{fontStyle: 'italic'}}>&nbsp;i&nbsp;</Text>
            TT
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: '#7f7f7f',
              textAlign: 'center',
              top: 130,
            }}>
            AI-based Tyre Specification Reading and Downstream Analytics
          </Text>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => {
              navigation.navigate('Login');
            }}>
            <Text style={styles.text}>Get started</Text>
          </TouchableOpacity>
          <View style={styles.developedByView}>
            <Text style={styles.developedByText}>Developed by</Text>
          </View>
          <View style={styles.developedByInfoView}>
            <Image source={logoKGP2} style={styles.logoKGP2} />
            <View style={styles.developedByTextView}>
              <Text style={styles.developedByTextLines}>
                Centre of Excellence in Advanced
              </Text>
              <Text style={styles.developedByTextLines}>
                Manufacturing Technology
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

export default Home;

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
    height: '55%',
    alignItems: 'center',
  },
  text1: {
    top: 70,
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
    top: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#31367b',
  },
  developedByView: {
    top: 225,
    alignSelf: 'flex-start',
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
    top: 220,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoKGP2: {
    right: 20,
    resizeMode: 'contain',
    width: 60,
    height: 60,
  },
  developedByTextView: {
    padding: 10,
  },
  developedByTextLines: {
    fontSize: 15.5,
    color: 'black',
  },
});
