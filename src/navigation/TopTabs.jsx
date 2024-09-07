// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {s, vs, ms, ScaledSheet} from 'react-native-size-matters';

// import AboutApp from "../screens/about/AboutApp";
// import AboutCoEAMT from "../screens/about/AboutCoEAMT";
// import Profile from "../screens/user/Profile";
// import doc from "../utils/images/doc.png";
// import profile from "../utils/images/profile.png";
// import question from "../utils/images/question.png";

const TopTabs = props => {
  const route = useRoute();
  const [currentScreenName, setCurrentScreenName] = useState(route.name);
  const navigation = useNavigation();

  useEffect(() => {
    setCurrentScreenName(route.name);
  }, [route]);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentScreenName(route.name);
      console.log('Current screen name from top tabs: ', currentScreenName);
    }, [route]),
  );

  // console.log("leftprops", props.left);
  return (
    <View
      style={{
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: vs(70),
        width: '100%',
        // backgroundColor: '#31367b',
        backgroundColor: '#0f113e',
        borderBottomLeftRadius: s(40),
        borderBottomRightRadius: s(40),
      }}>
      <TouchableOpacity
        style={{
          width: '33%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        // onPress={() => navigation.navigate('Profile')}>
        onPress={props.tabLeftFunc}>
        <Image source={props.left} style={{width: s(20), height: s(15)}} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '33%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        // onPress={() => navigation.navigate("Profile")}
      >
        <Image
          source={props.center}
          style={{
            resizeMode: 'contain',
            width: s(80),
            height: vs(90),
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
        onPress={
          //   () => {
          //   if (currentScreenName === "Smodel") {
          //     // If on "Smodel" screen, use tabRightFunc
          //     props.tabRightFunc;
          //   } else {
          //     // Otherwise, navigate to "AboutApp" screen
          //     navigation.navigate("AboutApp");
          //   }
          // }
          props.tabRightFunc
        }>
        <Image source={props.right} style={{width: s(22), height: s(22)}} />
      </TouchableOpacity>
      {/* Add more TouchableOpacity components for other tabs */}
    </View>
  );
};

export default TopTabs;
