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
  Alert,
  Keyboard,
  Modal,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {s, vs, ms, ScaledSheet} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

import {Formik, FieldArray, Field} from 'formik';
import * as yup from 'yup';

import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {setTokenGlobal} from '../../state/tokenslice';
import {setCreden} from '../../state/credenSlice';

import Tabs from '../../navigation/Tabs';
import TopTabs from '../../navigation/TopTabs';

import image from '../../utils/images/light.png';
import backgroundImage from '../../utils/images/backgroundImage.png';
import logoTATA from '../../utils/images/logoTATA.png';
import logoApp from '../../utils/images/logoApp.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import id from '../../utils/images/id.png';
import dash from '../../utils/images/dash.png';
import logout from '../../utils/images/logout.png';
import logoTyre from '../../utils/images/logoTyre.png';
import question from '../../utils/images/question.png';
import ham from '../../utils/images/ham.png';
import deleteIcon from '../../utils/images/delete.png';
import pencil from '../../utils/images/vcPencil.png';
import search from '../../utils/images/search.png';
import searchblack from '../../utils/images/searchblack.png';

// import GoodVibes from "../../../assets/fonts/GreatVibes-Regular.ttf";
import {URI} from '@env';

// const windowWidth = useWindowDimensions().width;

const reviewSchema = yup.object({
  mod_num: yup.string().required(),
  num_axles: yup.number().required(),
  axles_data: yup.array().of(
    yup.object({
      // axle_id: yup.number().required(),
      axle_location: yup.string().required(),
      axle_type: yup.string().required(),
      wheels_data: yup.array().of(
        yup.object({
          wheel_id: yup.number().required(),
          wheel_pos: yup.string().required(),
        }),
      ),
    }),
  ),
});

const Addmodel = ({navigation}) => {
  const textInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imguri, setImguri] = useState('');
  const [vc, setVc] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [vcList, setVcList] = useState([]);
  const [filteredVcList, setFilteredVcList] = useState([]); // State for filtered list
  const [editedVc, setEditedVc] = useState('');

  const handleTextInputClick = () => {
    if (textInputRef.current) {
      textInputRef.current.blur();
      textInputRef.current.focus();
    }
  };

  const dispatch = useDispatch();
  const globalToken = useSelector(state => state.token.tokenGlobal);
  const creden = useSelector(state => state.creden.creden);

  console.log('URI:', creden.URI);

  const onSubmit = async values => {
    //Alert the user
    // const formattedAxlesData = values.axles_data.map((axle, axleIndex) => {
    //   const formattedWheelsData = axle.wheels_data.map((wheel, wheelIndex) => {
    //     return `Wheel ID: ${wheel.wheel_id}\nWheel Pos: ${wheel.wheel_pos}`;
    //   });

    //   return `Axle ${axleIndex + 1}:\nAxle ID: ${
    //     axle.axle_id
    //   }\nAxle Location: ${axle.axle_location}\nAxle Type: ${
    //     axle.axle_type
    //   }\n\n${formattedWheelsData.join("\n\n")}`;
    // });

    // Alert.alert(
    //   "Vehicle Added",
    //   `Model Number: ${values.mod_num}\nNumber of Axles: ${
    //     values.num_axles
    //   }\n\nAxles Data:\n${formattedAxlesData.join("\n\n")}`,
    //   [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    // );

    // Append the "vc" field to the values object
    const dataToSend = {
      ...values,
      vc,
      imguri,
    };

    // Log the data before sending
    console.log('Data to send:', dataToSend);

    try {
      // Send the data using Axios
      const response = await axios.post(`${creden.URI}/add_vc/`, dataToSend, {
        params: {
          token: globalToken,
        },
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      });
      setEditedVc('');
      console.log('Response:', response.data);

      // Show success message or perform any other actions
      Alert.alert('Success', 'VC added successfully');
    } catch (error) {
      console.error('Error submitting data:', error);
      // Handle error, show error message, etc.
      Alert.alert('Error', 'Failed to submit data. Please try again later.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Do you really want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              const response = await axios.post(
                `${creden.URI + '/logout'}?token=${globalToken}`,
              );
              dispatch(
                setCreden({
                  ticket: null,
                  URI: creden.URI,
                  WS_URI: creden.WS_URI,
                  RTMP_URI: creden.RTMP_URI,
                }),
              );
              AsyncStorage.setItem('token', '');
              AsyncStorage.setItem('ticket', '');
              AsyncStorage.setItem('isLoggedIn', '');
              console.log('Logout successful', response.data);
              // navigation.navigate('Login');
              navigation.navigate('LoginNav', {screen: 'Login'});
            } catch (error) {
              console.error('Error logging out', error);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const selectImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      // console.log("result", result);
      if (!result.canceled) {
        await saveImage(result.assets[0].uri); // Pass the URI of the selected image to saveImage
      }
    } catch (error) {
      console.error('Error selecting image', error);
    }
  };

  const saveImage = async image => {
    try {
      setImage(image);
      console.log('Image saved successfully', image);
    } catch (error) {
      //   throw error;
      console.error('Error saving image', error);
    }
  };

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

  const uploadImage = async () => {
    try {
      // Validate if both VC number and image are present
      if (!vc || !image) {
        // Show an alert to the user
        Alert.alert(
          'Incomplete Details',
          'Please provide both VC number and VC chasis image.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
        return;
      }

      const formData = new FormData();
      formData.append('photo', {
        uri: image,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      formData.append('vc', vc);
      formData.append('token', globalToken);

      console.log('Form data:', formData);

      // const response = await axios.post(
      //   `${URI + "/upload_vc_image/"}`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //       // accept: "application/json",
      //     },
      //   }
      // );
      // console.log("Image uploaded successfully", response.data);
      // setImguri(response.data);

      let res = await fetch(`${creden.URI + '/upload_vc_image/'}`, {
        method: 'post',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: "Bearer lemon",
        },
      }).catch(function (error) {
        console.log(
          'There has been a problem with your main fetch operation: ' +
            error.message,
        );
        throw error;
      });

      let responseJson = await res.json().catch(function (error) {
        // Handle response JSON error if needed
      });
      console.log('Image posted successfully: ', responseJson);
      setImguri(responseJson);
      setVisible(true);
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };

  const fetchVcList = async () => {
    console.log('globalToken:', globalToken);
    try {
      const response = await axios.get(`${creden.URI}/vc_list/`, {
        params: {
          token: globalToken,
        },
        headers: {
          Accept: 'application/json',
        },
      });
      console.log('vclist:', response.data.cars);
      setVcList(response.data.cars);
      setFilteredVcList(response.data.cars); // Initialize filtered list with all VCs
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const vcDelete = async vc => {
    Alert.alert(
      'Confirm Delete',
      `Do you really want to remove VC no ${vc} ?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            // console.log('globalToken:', globalToken);
            try {
              const response = await axios.delete(`${creden.URI}/vc/${vc}`, {
                params: {
                  token: globalToken,
                },
                headers: {
                  Accept: 'application/json',
                },
              });
              console.log('vc_deleted', response.data);
              fetchVcList();
            } catch (error) {
              console.error('Error deleting vc: ', error);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    fetchVcList();
  }, []);

  const renderItem = ({item, index}) => (
    <View
      style={{
        marginTop: vs(10),
        padding: s(10),
        paddingHorizontal: s(2),
        // marginVertical: vs(8),
        backgroundColor: '#f9f9f9',
        borderRadius: ms(5),
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // backgroundColor: 'red',
        }}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: ms(15),
              // padding: s(3),
              width: s(30),
              height: s(30),
              marginRight: s(5),
              backgroundColor: 'blue',
            }}>
            <Text
              style={{
                fontSize: ms(20),
                color: 'white',
              }}>
              {index + 1}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: ms(16),
                color: 'black',
              }}>
              {item.vc}
            </Text>
            <Text
              style={{
                fontSize: ms(9),
                color: 'black',
              }}>
              {item.mod_num}
            </Text>
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            // alignSelf: "flex-end",
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: 'pink',
            width: s(70),
            marginRight: s(5),
          }}>
          {/* <Text>hello</Text> */}
          <TouchableOpacity
            onPress={() => {
              setImguri(item.imguri);
              setEditedVc(item.vc);
              setVisible(true);
            }}>
            <Image
              source={pencil}
              style={{resizeMode: 'contain', height: vs(25), width: s(30)}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => vcDelete(item.vc)}>
            <Image
              source={deleteIcon}
              style={{resizeMode: 'contain', height: vs(25), width: s(25)}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Function to filter VC list based on search query
  const handleSearch = query => {
    const filteredList = vcList.filter(vcItem =>
      vcItem.vc.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredVcList(filteredList);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar />
      <TopTabs
        left={ham}
        center={logoApp}
        right={question}
        tabLeftFunc={() => navigation.navigate('Profile')}
        tabRightFunc={() => navigation.navigate('AboutApp')}
      />

      <View style={[styles.linearGradient]}>
        <View style={{top: 10}}>
          <Text
            style={{
              fontSize: ms(16),
              color: '#7f7f7f',
              // textAlign: "center",
            }}>
            Add the new VC details
          </Text>
        </View>
        <View
          style={{
            top: vs(8),
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            height: vs(80),
            width: '80.5%',
          }}>
          <Text style={{fontSize: ms(15), fontWeight: 'bold', color: 'black'}}>
            VC no.
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: vs(18),
              borderWidth: 1.5,
              borderColor: '#3758ff',
              borderRadius: ms(12),
              paddingHorizontal: s(5),
              backgroundColor: 'white',
              // top: 40,
            }}>
            <TextInput
              placeholder=" VC no."
              placeholderTextColor="grey"
              style={{
                width: '100%',
                height: vs(33),
                fontSize: ms(14),
                color: 'black',
              }}
              value={vc}
              onChangeText={text => setVc(text)}
            />
          </View>
        </View>

        <View
          style={{
            width: '80%',
            flexDirection: 'row',
            // alignItems: "center",
            justifyContent: 'space-between',
            // backgroundColor: "red",
            // top: 5,
          }}>
          <View>
            <TouchableOpacity
              style={{
                // top: 30,
                // height: 30,
                backgroundColor: '#d9d9d9',
                borderWidth: 2,
                borderColor: '#fff',
                borderRadius: s(10),
                justifyContent: 'center',
                alignItems: 'center',
                padding: s(4),
              }}
              onPress={selectImage}>
              <Text style={{color: 'black'}}>Choose image file</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              borderWidth: 1.5,
              // top: 40,
              height: s(140),
              width: s(140),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {image ? (
              <Image
                source={{uri: image}}
                style={{
                  resizeMode: 'contain',
                  height: s(140),
                  width: s(140),
                  // top: 50,
                }}
              />
            ) : (
              <Text style={{color: 'black'}}>No file chosen</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={{
            width: s(200),
            height: vs(35),
            top: 10,
            borderRadius: ms(12),
            // borderWidth: 3,
            // borderColor: "#3758ff",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: '#3758ff',
          }}
          onPress={uploadImage}>
          <Text
            style={{color: '#fff', fontWeight: 'bold', letterSpacing: ms(0.8)}}>
            Proceed
          </Text>
        </TouchableOpacity>

        <View
          style={{
            // flex: 1,
            marginTop: vs(27),
            marginLeft: s(8),
            marginRight: s(8),
            borderRadius: ms(10),
            padding: s(8),
            width: '95%',
            height: '41.5%',
            // backgroundColor: 'red',
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              // alignItems: 'center',
              backgroundColor: '#374aff',
              flex: 1,
              paddingTop: vs(4),
              paddingHorizontal: s(10),
              borderRadius: ms(10),
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                // width: 200,
                // height: 30,
                // alignSelf: 'center',
                // borderRadius: 30,
                // borderWidth: 3,
                // borderColor: "#31367b",
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                // backgroundColor: '#31367b',
                marginBottom: vs(4),
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: ms(16),
                  letterSpacing: ms(1.5),
                  textAlign: 'center',
                  textDecorationLine: 'underline',
                  // alignSelf: 'center',

                  //   justifyContent: "center",
                  //   alignItems: "center",
                }}>
                List of current VC's
              </Text>
              <TouchableOpacity
                style={{
                  // backgroundColor: 'red',
                  // alignSelf: 'flex-end',
                  position: 'absolute',
                  right: s(8),
                  top: vs(2),
                }}
                onPress={() => {
                  // setImguri(item.imguri);
                  // setEditedVc(item.vc);
                  setListVisible(true);
                  setTimeout(() => {
                    if (textInputRef.current) {
                      // textInputRef.current.blur();
                      textInputRef.current.focus();
                    }
                  }, 800);

                  // if (listVisible && textInputRef.current) {
                  //   textInputRef.current.focus();
                  //   console.log('done');
                  // }
                }}>
                <Image
                  source={search}
                  style={{resizeMode: 'contain', height: vs(22), width: s(20)}}
                />
              </TouchableOpacity>
            </View>
            {/* <TextInput
              style={{width: '100%', height: 40, fontSize: 16, color: 'black'}}
              placeholder="Search VC number"
              placeholderTextColor="grey"
              onChangeText={handleSearch} // Update filtered list based on search input
            /> */}

            <FlatList
              data={filteredVcList} // Render the filtered list
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          </View>
        </View>
      </View>
      {!keyboardVisible && (
        <Tabs
          left={dash}
          center={logoKGP2}
          right={logout}
          tabLeftFunc={() => navigation.navigate('Dashboard')}
          tabRightFunc={handleLogout}
        />
      )}
      <Modal
        visible={listVisible}
        animationType="fade"
        onRequestClose={() => {
          setListVisible(false);
          textInputRef.current.blur();
        }}>
        <View
          style={{
            flex: 1,
            // marginTop: 30,
            display: 'flex',
            // justifyContent:"center",
            alignItems: 'center',
            marginLeft: s(10),
            marginRight: ms(10),
            borderRadius: s(10),
            padding: s(10),
            paddingTop: vs(30),
            width: '95%',
            height: '70%',
            // backgroundColor: "red",
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              // alignItems: 'center',
              backgroundColor: '#374aff',
              // flex: 1,
              height: '91%',
              padding: s(12),
              paddingHorizontal: s(12),
              borderRadius: ms(10),
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                // width: 200,
                // height: 30,
                // alignSelf: 'center',
                // borderRadius: 30,
                // borderWidth: 3,
                // borderColor: "#31367b",
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                // backgroundColor: '#31367b',
                marginBottom: vs(15),
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: ms(17),
                  letterSpacing: ms(1.5),
                  textAlign: 'center',
                  textDecorationLine: 'underline',
                  // alignSelf: 'center',

                  //   justifyContent: "center",
                  //   alignItems: "center",
                }}>
                List of current VC's
              </Text>
              <TouchableOpacity
                style={{
                  // backgroundColor: 'red',
                  // alignSelf: 'flex-end',
                  position: 'absolute',
                  left: s(10),
                  // top: 2,
                }}
                onPress={() => {
                  // setImguri(item.imguri);
                  // setEditedVc(item.vc);
                  setListVisible(false);
                }}>
                <Text
                  style={{fontSize: ms(25), fontWeight: 'bold', color: '#fff'}}>
                  ←
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: s(5),
                borderRadius: ms(10),
                width: '100%',
                height: vs(35),
                fontSize: ms(16),
                backgroundColor: '#fff',
                marginBottom: vs(5),
              }}>
              <TextInput
                ref={textInputRef}
                style={{
                  color: 'black',
                  // backgroundColor: 'red',
                  width: '100%',
                }}
                placeholder="Search VC"
                placeholderTextColor="grey"
                onChangeText={handleSearch} // Update filtered list based on search input
              ></TextInput>
              <TouchableOpacity onPress={handleTextInputClick}>
                <Image
                  source={searchblack}
                  style={{resizeMode: 'contain', height: vs(24), width: s(24)}}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredVcList} // Render the filtered list
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          </View>
        </View>
      </Modal>
      <Modal
        visible={visible}
        animationType="fade"
        onRequestClose={() => {
          setVisible(false);
          setEditedVc('');
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <View style={styles.container}>
            <Formik
              initialValues={{
                mod_num: editedVc ? editedVc : '',
                num_axles: 0,
                axles_data: [
                  {
                    // axle_id: 0,
                    axle_location: '',
                    axle_type: '',
                    wheels_data: [
                      {
                        wheel_id: 0,
                        wheel_pos: '',
                      },
                    ],
                  },
                ],
              }}
              validationSchema={reviewSchema}
              onSubmit={(values, actions) => {
                onSubmit(values);
                console.log('Values:', values);
                actions.resetForm();
              }}>
              {props => (
                <View>
                  <Text style={{color: 'black'}}>Model no:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Model Number"
                    placeholderTextColor="grey"
                    onChangeText={props.handleChange('mod_num')}
                    value={props.values.mod_num}
                  />
                  <Text style={styles.errText}>
                    {props.touched.mod_num && props.errors.mod_num}
                  </Text>

                  <Text style={{color: 'black'}}>Number of axles:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Number of Axles"
                    placeholderTextColor="black"
                    onChangeText={props.handleChange('num_axles')}
                    value={props.values.num_axles.toString()}
                    keyboardType="numeric"
                  />
                  <Text style={styles.errText}>
                    {props.touched.num_axles && props.errors.num_axles}
                  </Text>

                  <Text style={{color: 'black'}}>Axles:</Text>
                  <ScrollView
                    nestedScrollEnabled={true}
                    style={styles.axleScrollView}>
                    <FieldArray name="axles_data">
                      {({push, remove}) => (
                        <>
                          {props.values.axles_data.map((axle, axleIndex) => (
                            <View key={axleIndex}>
                              <Text style={{fontWeight: 'bold'}}>
                                Axle {axleIndex + 1}:
                              </Text>
                              {/* <Field name={`axles_data[${axleIndex}].axle_id`}>
                                {({field}) => (
                                  <>
                                    <Text style={{color: 'black'}}>
                                      Axle ID:
                                    </Text>
                                    <TextInput
                                      style={styles.input}
                                      placeholder="Axle ID"
                                      placeholderTextColor="grey"
                                      onChangeText={text =>
                                        props.handleChange(
                                          `axles_data[${axleIndex}].axle_id`,
                                        )(text)
                                      }
                                      value={field.value.toString()}
                                      keyboardType="numeric"
                                    />
                                  </>
                                )}
                              </Field> */}
                              <Field
                                name={`axles_data[${axleIndex}].axle_location`}>
                                {({field}) => (
                                  <>
                                    <Text style={{color: 'black'}}>
                                      Axle Location:
                                    </Text>
                                    <TextInput
                                      style={styles.input}
                                      placeholder="Axle Location"
                                      placeholderTextColor="grey"
                                      onChangeText={text =>
                                        props.handleChange(
                                          `axles_data[${axleIndex}].axle_location`,
                                        )(text)
                                      }
                                      value={field.value}
                                    />
                                  </>
                                )}
                              </Field>
                              <Field
                                name={`axles_data[${axleIndex}].axle_type`}>
                                {({field}) => (
                                  <>
                                    <Text>Axle Type:</Text>
                                    <TextInput
                                      style={styles.input}
                                      placeholder="Axle Type"
                                      placeholderTextColor="grey"
                                      onChangeText={text =>
                                        props.handleChange(
                                          `axles_data[${axleIndex}].axle_type`,
                                        )(text)
                                      }
                                      value={field.value}
                                    />
                                  </>
                                )}
                              </Field>
                              <Text style={{color: 'black'}}>Wheels:</Text>
                              <ScrollView
                                nestedScrollEnabled={true}
                                style={styles.wheelScrollView}>
                                <FieldArray
                                  name={`axles_data[${axleIndex}].wheels_data`}>
                                  {({push, remove}) => (
                                    <>
                                      {axle.wheels_data.map(
                                        (wheel, wheelIndex) => (
                                          <View key={wheelIndex}>
                                            <Text
                                              style={{
                                                fontWeight: 'bold',
                                                color: 'black',
                                              }}>
                                              Wheel {wheelIndex + 1}:
                                            </Text>

                                            <Field
                                              name={`axles_data[${axleIndex}].wheels_data[${wheelIndex}].wheel_id`}>
                                              {({field}) => (
                                                <>
                                                  <Text
                                                    style={{color: 'black'}}>
                                                    Wheel ID:
                                                  </Text>
                                                  <TextInput
                                                    style={styles.input}
                                                    placeholder="Wheel ID"
                                                    placeholderTextColor="grey"
                                                    onChangeText={text =>
                                                      props.handleChange(
                                                        `axles_data[${axleIndex}].wheels_data[${wheelIndex}].wheel_id`,
                                                      )(text)
                                                    }
                                                    value={field.value.toString()}
                                                    keyboardType="numeric"
                                                  />
                                                </>
                                              )}
                                            </Field>
                                            <Field
                                              name={`axles_data[${axleIndex}].wheels_data[${wheelIndex}].wheel_pos`}>
                                              {({field}) => (
                                                <>
                                                  <Text
                                                    style={{color: 'black'}}>
                                                    Wheel Pos:
                                                  </Text>
                                                  <TextInput
                                                    style={styles.input}
                                                    placeholder="Wheel Pos"
                                                    placeholderTextColor="grey"
                                                    onChangeText={text =>
                                                      props.handleChange(
                                                        `axles_data[${axleIndex}].wheels_data[${wheelIndex}].wheel_pos`,
                                                      )(text)
                                                    }
                                                    value={field.value}
                                                  />
                                                </>
                                              )}
                                            </Field>
                                          </View>
                                        ),
                                      )}
                                      <Button
                                        title="Add Wheel"
                                        onPress={() =>
                                          push({
                                            make: '',
                                            scn_day: 0,
                                            scn_month: 0,
                                            scn_year: 0,
                                            size: '',
                                            vin: '',
                                            wheel_id: 0,
                                            wheel_pos: '',
                                          })
                                        }
                                      />
                                    </>
                                  )}
                                </FieldArray>
                              </ScrollView>
                            </View>
                          ))}
                          <Button
                            title="Add Axle"
                            onPress={() =>
                              push({
                                // axle_id: 0,
                                axle_location: '',
                                axle_type: '',
                                wheels_data: [
                                  {
                                    make: '',
                                    scn_day: 0,
                                    scn_month: 0,
                                    scn_year: 0,
                                    size: '',
                                    vin: '',
                                    wheel_id: 0,
                                    wheel_pos: '',
                                  },
                                ],
                              })
                            }
                          />
                        </>
                      )}
                    </FieldArray>
                  </ScrollView>

                  <Button
                    title="Submit"
                    color="maroon"
                    onPress={props.handleSubmit}
                  />
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Addmodel;

const styles = ScaledSheet.create({
  safeContainer: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    margin: '15@s',
    width: '90%',
    // backgroundColor: "red",
  },
  input: {
    borderWidth: '1@s',
    borderColor: '#ddd',
    padding: '10@s',
    fontSize: '18@ms',
    borderRadius: '6@s',
    marginBottom: '10@vs',
    color: 'black',
  },
  errText: {
    color: 'crimson',
    fontWeight: 'bold',
    marginBottom: '10@vs',
    marginTop: '6@vs',
  },
  axleScrollView: {
    maxHeight: '300@vs',
    marginBottom: '10@vs',
  },
  wheelScrollView: {
    maxHeight: '200@vs',
    borderRadius: '5@s',
    backgroundColor: '#b3b3b3',
    marginBottom: '10@vs',
  },
});
