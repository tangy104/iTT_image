import React, {useEffect, useState, useRef} from 'react';
import {TouchableOpacity, View, Image, Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {s, vs, ms, ScaledSheet} from 'react-native-size-matters';

const ProgressBar = ({progress}) => {
  return (
    <View
      style={{
        height: vs(3),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(2),
        overflow: 'hidden',
      }}>
      <View
        style={{
          height: '100%',
          backgroundColor: '#31367b',
          width: `${progress * 100}%`,
        }}
      />
    </View>
  );
};

const Tabs = props => {
  const route = useRoute();
  const [currentScreenName, setCurrentScreenName] = useState(route.name);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const webViewRef = useRef(null);

  useEffect(() => {
    setCurrentScreenName(route.name);
  }, [route]);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentScreenName(route.name);
      console.log('Current screen name: ', currentScreenName);
    }, [route]),
  );

  const navigation = useNavigation();

  const openLinkInWebView = () => {
    setVisible(true);
  };

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleProgressChange = event => {
    const {nativeEvent} = event;
    setProgress(nativeEvent.progress);
  };

  const handleNavigationStateChange = navState => {
    if (webViewRef.current && navState.canGoBack) {
      navigation.setOptions({gestureEnabled: false});
    } else {
      navigation.setOptions({gestureEnabled: true});
    }
  };

  const goBackInWebView = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          height: vs(55),
          width: '100%',
          // backgroundColor: '#31367b',
          backgroundColor: '#0f113e',
          borderTopLeftRadius: s(35),
          borderTopRightRadius: s(35),
          zIndex: 2,
        }}>
        {/* Left button */}
        <TouchableOpacity
          style={{
            width: '33%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={props.tabLeftFunc}>
          <Image source={props.left} style={{width: s(28), height: s(28)}} />
        </TouchableOpacity>

        {/* Center button */}
        <TouchableOpacity
          style={{
            width: '33%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (currentScreenName === 'LogInHome') {
              navigation.navigate('Login');
            } else if (
              currentScreenName === 'Login' ||
              currentScreenName === 'Profile'
            ) {
              // openLinkInWebView();
            } else {
              // openLinkInWebView();
            }
          }}>
          <Image
            source={props.center}
            style={{
              resizeMode: 'contain',
              // top: -34,
              top: vs(-18),
              width: currentScreenName === 'Home' ? s(80) : s(75),
            }}
          />
        </TouchableOpacity>

        {/* Right button */}
        <TouchableOpacity
          style={{
            width: '33%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={props.tabRightFunc}>
          <Image source={props.right} style={{width: s(28), height: s(28)}} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => setVisible(false)}>
        <View style={{flex: 1}}>
          {/* Back button */}
          {/* <TouchableOpacity
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 1, // Ensure the button appears above the WebView
            }}
            onPress={goBackInWebView}
          >
            <Image source={logout} style={{ width: 30, height: 30 }} />
          </TouchableOpacity> */}

          {loading && <ProgressBar progress={progress} />}

          <WebView
            ref={webViewRef}
            source={{
              uri:
                currentScreenName === 'Profile' ||
                currentScreenName === 'AdminScreen'
                  ? 'https://tatamotors.com/'
                  : 'https://coeamt.com/',
            }}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onLoadProgress={handleProgressChange}
            onNavigationStateChange={handleNavigationStateChange}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Tabs;
