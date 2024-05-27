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
} from 'react-native';
import React, {useState, useEffect} from 'react';
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
  const [image, setImage] = useState(null);
  const [imguri, setImguri] = useState('');
  const [vc, setVc] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const globalToken = useSelector(state => state.token.tokenGlobal);
  const creden = useSelector(state => state.creden.creden);

  console.log('URI:', URI);

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
      const response = await axios.post(`${URI}/add_vc/`, dataToSend, {
        params: {
          token: globalToken,
        },
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      });
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
                `${URI + '/logout'}?token=${globalToken}`,
              );
              dispatch(
                setCreden({
                  ticket: null,
                  URI: creden.URI,
                  WS_URI: creden.WS_URI,
                  RTMP_URI: creden.RTMP_URI,
                }),
              );
              console.log('Logout successful', response.data);
              navigation.navigate('Login');
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

      let res = await fetch(`${URI + '/upload_vc_image/'}`, {
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

      <View style={styles.linearGradient}>
        <View style={{top: 20}}>
          <Text
            style={{
              fontSize: 17,
              color: '#7f7f7f',
              // textAlign: "center",
            }}>
            Add the new VC details
          </Text>
        </View>
        <View
          style={{
            top: 40,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            height: 100,
            width: '80%',
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
            VC no.
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
              borderWidth: 1.5,
              borderColor: '#3758ff',
              borderRadius: 12,
              paddingHorizontal: 10,
              backgroundColor: 'white',
              // top: 40,
            }}>
            <TextInput
              placeholder=" VC no."
              placeholderTextColor="grey"
              style={{width: '100%', height: 40, fontSize: 16, color: 'black'}}
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
            top: 40,
          }}>
          <View>
            <TouchableOpacity
              style={{
                // top: 30,
                // height: 30,
                backgroundColor: '#d9d9d9',
                borderWidth: 2,
                borderColor: '#fff',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
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
              height: 160,
              width: 160,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {image ? (
              <Image
                source={{uri: image}}
                style={{
                  resizeMode: 'contain',
                  height: 160,
                  width: 160,
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
            width: 220,
            height: 40,
            top: 70,
            borderRadius: 12,
            // borderWidth: 3,
            // borderColor: "#3758ff",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: '#3758ff',
          }}
          onPress={uploadImage}>
          <Text style={{color: '#fff', fontWeight: 'bold', letterSpacing: 0.8}}>
            Proceed
          </Text>
        </TouchableOpacity>
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
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
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
                mod_num: '',
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

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },

  linearGradient: {
    flex: 1,
    alignItems: 'center',
  },

  container: {
    flex: 1,
    margin: 15,
    width: '90%',
    // backgroundColor: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 10,
    color: 'black',
  },
  errText: {
    color: 'crimson',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 6,
  },
  axleScrollView: {
    maxHeight: 300,
    marginBottom: 10,
  },
  wheelScrollView: {
    maxHeight: 200,
    borderRadius: 5,
    backgroundColor: '#b3b3b3',
    marginBottom: 10,
  },
});
