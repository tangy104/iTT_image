import React, {useEffect, useState, useRef} from 'react';
import {TouchableOpacity, View, Image, Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import {WebView} from 'react-native-webview';

const ProgressBar = ({progress}) => {
  return (
    <View
      style={{
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
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
          height: 70,
          width: '100%',
          backgroundColor: '#31367b',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
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
          <Image source={props.left} style={{width: 30, height: 30}} />
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
            } else {
              openLinkInWebView();
            }
          }}>
          <Image
            source={props.center}
            style={{
              resizeMode: 'contain',
              // top: -34,
              top: -18,
              width: currentScreenName === 'Home' ? 90 : 85,
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
          <Image source={props.right} style={{width: 30, height: 30}} />
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
