// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';

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
        height: 90,
        width: '100%',
        backgroundColor: '#31367b',
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
        // onPress={() => navigation.navigate('Profile')}>
        onPress={props.tabLeftFunc}>
        <Image
          source={props.left}
          style={{resizeMode: 'contain', width: 25, height: 25}}
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
      >
        <Image
          source={props.center}
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
        <Image source={props.right} style={{width: 25, height: 23}} />
      </TouchableOpacity>
      {/* Add more TouchableOpacity components for other tabs */}
    </View>
  );
};

export default TopTabs;
