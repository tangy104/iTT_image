import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  TextInput,
  Touchable,
  Modal,
} from 'react-native';

import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {active, inactive} from '../../state/alertSlice';
import {setSelectedWheelDataGlobal} from '../../state/selectSlice';
import {setTinGlobal} from '../../state/tinslice';
import {setCreden} from '../../state/credenSlice';
import axios from 'axios';
import {URI, WS_URI} from '@env';

import TopTabs from '../../navigation/TopTabs';
import Tabs from '../../navigation/Tabs';

import Chasis from '../../components/chasis/ChasisSmodel';
import Details from '../../components/details/Details';

import ham from '../../utils/images/ham.png';
import logoApp from '../../utils/images/logoApp.png';
// import question from "../../utils/images/question.png";
import dash from '../../utils/images/dash.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import logout from '../../utils/images/logout.png';
import logoTyre2 from '../../utils/images/logoTyre2.png';
import chassis from '../../utils/images/chassis.jpg';
import settings from '../../utils/images/settings.png';
import close from '../../utils/images/close.png';
import {StatusBar} from 'expo-status-bar';
// import { isEnabled } from "react-native/Libraries/Performance/Systrace";

const Smodel = ({navigation, route}) => {
  const dummyData = {
    id: '66449c4a9af26731f307d869',
    mod_num: 'SIGNA 2830.K BSVI HD',
    vin: null,
    vc: '51581142000R',
    num_axles: 3,
    imguri: null,
    car_record_created_by: null,
    axles_data: [
      {
        axle_location: 'FF',
        axle_type: '2',
        wheels_data: [
          {
            wheel_pos: 'L',
            wheel_id: 1,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'R',
            wheel_id: 1,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
        ],
      },
      {
        axle_location: 'RF',
        axle_type: '4',
        wheels_data: [
          {
            wheel_pos: 'L',
            wheel_id: 1,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'R',
            wheel_id: 1,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'L',
            wheel_id: 2,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'R',
            wheel_id: 2,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
        ],
      },
      {
        axle_location: 'RR',
        axle_type: '4',
        wheels_data: [
          {
            wheel_pos: 'L',
            wheel_id: 1,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'R',
            wheel_id: 1,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'L',
            wheel_id: 2,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
          {
            wheel_pos: 'R',
            wheel_id: 2,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
        ],
      },
      {
        axle_location: 'Spare',
        axle_type: '2',
        wheels_data: [
          {
            wheel_pos: 'S',
            wheel_id: 1,
            tin: null,
            scn_year: null,
            scn_month: null,
            scn_day: null,
            scn_time: null,
            scn_compound: null,
            wheel_record_last_edited_by: null,
            img_filename: null,
          },
        ],
      },
    ],
  };

  const dispatch = useDispatch();
  const alert = useSelector(state => state.alert.value);
  const globalTin = useSelector(state => state.tin.tinGlobal);

  const selectedWheelData = useSelector(
    state => state.app.selectedWheelDataGlobal,
  );
  const globalToken = useSelector(state => state.token.tokenGlobal);
  const creden = useSelector(state => state.creden.creden);

  console.log('creden from Smodel', creden);

  console.log('redux', alert);
  // console.log("Global token in Smodel:", globalToken);
  const [data, setData] = useState([]);
  const [apiResponseData, setApiResponseData] = useState(null);
  const [displayTin, setDisplayTin] = useState('');
  const [enableRescan, setEnableRescan] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [manualModal, setManualModal] = useState(false);
  const [manualTIN, setManualTIN] = useState('');
  const [failedAttempts, setFailedAttempts] = useState({});
  const [loading, setLoading] = useState(true);
  const chasisRef = useRef(null);
  const baseURL = 'https://jsonplaceholder.typicode.com';

  // const responseData = route.params?.responseData;
  // console.log("this is getback", responseData);

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    console.log('Dropdown visible', isDropdownVisible);
  };

  //Function to handle back button press
  // const handleBackButtonClick = () => {
  //   navigation.navigate("ScanVIN");
  //   return true;
  // };

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener(
  //       "hardwareBackPress",
  //       handleBackButtonClick
  //     );
  //   };
  // }, [navigation]);

  // Function to handle failed attempts
  const handleFailedAttempt = () => {
    const key = JSON.stringify(selectedWheelData); // Constructing unique key
    setFailedAttempts(prevState => ({
      ...prevState,
      [key]: (prevState[key] || 0) + 1, // Incrementing failed attempts
    }));
    console.log('Failed attempts:', failedAttempts);
  };

  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true before making the request
      const response = await axios.get(
        creden.URI + `/cars/${route.params.vin}`,
        {
          params: {
            token: globalToken,
          },
          headers: {
            Accept: 'application/json',
            // Authorization: `Bearer ${globalToken}`,
          },
        },

        // `http://10.145.118.93:1337/cars/65be938eb07ee8101f175c08`
      );

      setApiResponseData(response.data); // Set the API response data in state
      setData(response.data);
      // console.log("response data:", response.data.axles_data[0]);
      // console.log("response data:", response.data);
    } catch (error) {
      console.error('Error fetching data from smodel:', error);
    } finally {
      setLoading(false); // Set loading to false after the request completes (whether successful or not)
    }
  };

  useEffect(() => {
    setTimeout(async () => {
      // const newWs = new WebSocket("ws://10.145.16.146:1337/ws_main/105");
      const newWs = new WebSocket(`${creden.WS_URI}/ws_main/${creden.ticket}`);
      newWs.onopen = () => {
        // setServerState("Connected to the server");
        console.log('Opened, connected to the server');
      };
      newWs.onclose = e => {
        // setServerState("Disconnected. Check internet or server.");
        console.log('Disconnected. Check internet or server.');
      };
      newWs.onerror = e => {
        // setServerState(e.message);
        console.log(e.message);
      };

      newWs.onmessage = async e => {
        // Introduce a delay of 500 milliseconds using setTimeout
        setTimeout(async () => {
          fetchData();
          console.log('Updated vehicle');
          // Alert.alert("Alert", "New vehicle added");
        }, 100);
      };
    }, 2000);
  }, []);

  useEffect(() => {
    console.log('params', route.params.vin);
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before making the request
        const response = await axios.get(
          creden.URI + `/cars/${route.params.vin}`,
          {
            params: {
              token: globalToken,
            },
            headers: {
              Accept: 'application/json',
              // Authorization: `Bearer ${globalToken}`,
            },
          },

          // `http://10.145.118.93:1337/cars/65be938eb07ee8101f175c08`
        );

        setApiResponseData(response.data); // Set the API response data in state
        setData(response.data);
        // console.log("response data:", response.data.axles_data[0]);
        // console.log("response data:", response.data);
      } catch (error) {
        console.error('Error fetching data from Smodel:', error);
      } finally {
        setLoading(false); // Set loading to false after the request completes (whether successful or not)
      }
    };
    fetchData();
    setDisplayTin(
      route.params.responseData ? route.params.responseData.output : '',
    );
  }, [route.params.responseData, putData]);

  useFocusEffect(
    React.useCallback(() => {
      if (alert) {
        Alert.alert('Alert', 'Image not uploaded for the selected tyre wheel');
        dispatch(inactive());
      }
      chasisRef.current.time();
    }, [alert, dispatch]),
  );
  useEffect(() => {
    console.log('Smodel elapsedTime:', route.params?.elapsedTime);
  }, [route.params?.elapsedTime]);

  useEffect(() => {
    setDisplayTin(globalTin);
  }, [globalTin, dispatch]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('beforeRemove', e => {
  //     if (e.data.action.type === 'GO_BACK') {
  //       dispatch(
  //         setCreden({
  //           ticket: null,
  //           URI: creden.URI,
  //           WS_URI: creden.WS_URI,
  //           RTMP_URI: creden.RTMP_URI,
  //         }),
  //       );
  //     }
  //     console.log('changed credentials');
  //   });

  //   // Return the function to unsubscribe from the event so it gets cleaned up on unmount
  //   return unsubscribe;
  // }, [navigation, dispatch, creden]);

  const get_by_ID = () => {
    axios({
      method: 'GET',
      url: `${baseURL}/posts/${Math.floor(Math.random() * 100 + 1)}`,
    })
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  // console.log("model type:", typeof(route.params.model));

  const handleButtonPress = () => {
    // Call function after a delay
    console.log('Button Pressed');
    setTimeout(() => chasisRef.current.scanned(), 1000); // 1000 milliseconds = 1 seconds
  };

  const renderTINNumbers = () => {
    const axlesData = apiResponseData?.axles_data || [];

    return axlesData.map((axle, axleIndex) => {
      const wheelsData = axle?.wheels_data || [];

      return wheelsData.map((wheel, wheelIndex) => (
        <Details
          key={`axle-${axleIndex}-wheel-${wheelIndex}`}
          tyre={`Axle ${axleIndex + 1} - Wheel ${wheelIndex + 1}`}
          axle={axleIndex + 1}
          no={wheelIndex + 1}
          tin={wheel.tin || 'Not yet scanned'}
          axleLocation={axle.axle_location || 'N/A'}
          wheelPosition={wheel.wheel_pos || 'N/A'}
          // make={wheel.make || "N/A"}
          // size={wheel.size || "N/A"}
        />
      ));
    });
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

  //Function for posting TIN data manually
  const putData = async () => {
    // Check if data is present
    // const dataToPut = {
    //   token: globalToken,
    //   data: manualTIN,
    //   id: route.params.id,
    //   vin: apiResponseData.vin,
    //   axle_location: selectedWheelData.axle_location,
    //   axle_id: selectedWheelData.axle_id,
    //   wheel_pos: selectedWheelData.wheel_pos,
    //   wheel_id: selectedWheelData.wheel_id,
    // };
    // console.log("Data to put:", dataToPut);
    // console.log("url:", `${URI + "/car_wdata/tin"}`);

    if (manualTIN) {
      try {
        const response = await axios.put(
          `${creden.URI + '/car_wdata/tin'}`,
          null,
          {
            params: {
              token: globalToken,
              data: manualTIN,
              // id: route.params.id,
              vin: apiResponseData.vin,
              axle_location: selectedWheelData.axle_location,
              // axle_id: selectedWheelData.axle_id,
              wheel_pos: selectedWheelData.wheel_pos,
              wheel_id: selectedWheelData.wheel_id,
            },
            headers: {
              accept: 'application/json',
              // Authorization:
              // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU3NzYzOTIsInN1YiI6Ijc4OTQ1NiJ9.SERsXKqP1g5iV3Ly5zwmujj-9S3AgFKk2nvI8oPUMJI",
            },
          },
        );
        console.log('Response:', response.data);
        if (response.data) {
          dispatch(setTinGlobal(manualTIN));
          setManualTIN('');
          setManualModal(false);
          Alert.alert('TIN data saved successfully');
          fetchData();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      Alert.alert('Please enter the TIN No.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopTabs
        left={ham}
        center={logoApp}
        right={settings}
        tabRightFunc={toggleDropdown}
        tabLeftFunc={() => navigation.navigate('Profile')}
      />
      <View style={styles.container1}>
        {/* <Text>Smodel {route.params.model.id}</Text> */}
        <View style={{top: 70, flexDirection: 'row'}}>
          <Text style={{}}> Spare</Text>
        </View>

        <Chasis
          chasisRef={chasisRef}
          // model={dummyData}
          model={apiResponseData || route.params.model}
          // model={apiResponseData}
          enableRescan={enableRescan}
          // elapsedTime={route.params.elapsedTime}
          fromCameraScreen={route.params.fromCameraScreen ? true : false}
          // id={route.params.id}
          vin={route.params.vin}
        />
        <View
          style={{
            flexDirection: 'row',
            width: '55%',
            top: -20,
            justifyContent: 'space-between',
          }}>
          <Text>Left</Text>
          <Text>Right</Text>
        </View>
        {loading ? null : (
          // <ActivityIndicator size="large" color="#0000ff" />
          <View>
            {/* <View style={styles.container2}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    if (
                      chasisRef.current.selectedButtonFrontRight !== null ||
                      chasisRef.current.selectedButtonRear1Right !== null ||
                      chasisRef.current.selectedButtonRear2Right !== null ||
                      chasisRef.current.selectedButtonFrontLeft !== null ||
                      chasisRef.current.selectedButtonRear1Left !== null ||
                      chasisRef.current.selectedButtonRear2Left !== null
                    ) {
                      if (selectedWheelData.wheel_tin === "") {
                        navigation.navigate("CameraScreen", {
                          model: apiResponseData,
                          id: route.params.id,
                        });
                        handleButtonPress();
                      } else {
                        Alert.alert(
                          "Alert",
                          "Wheel already scanned, do you want to scan again?",
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Scan",
                              onPress: () => {
                                navigation.navigate("CameraScreen", {
                                  model: apiResponseData,
                                  id: route.params.id,
                                  vin:route.params.vin,
                                });
                                handleButtonPress();
                              },
                            },
                          ]
                        );
                      }
                    } else {
                      Alert.alert(
                        "Alert",
                        "No wheel selected, select wheel to perform scan"
                      );
                    }
                  }}
                >
                  <Text style={styles.text}>Scan TIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btn}
                  // onPress={() => navigation.navigate("Api")}
                  onPress={get_by_ID}
                >
                  <Text style={styles.text}>Get Serial Number</Text>
                </TouchableOpacity>
              </View> */}
            {/* <View style={styles.container3}>
                <TouchableOpacity
                  style={styles.btn2}
                  //   onPress={() => navigation.navigate("Smodel")}
                >
                  <Text style={styles.text}>VIN={apiResponseData.vin}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btn3}
                  //   onPress={() => navigation.navigate("Smodel")}
                >
                  <Text style={styles.text}>
                    Make={" "}
                    {route.params.responseData
                      ? route.params.responseData.make
                      : ""}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btn3}
                  //   onPress={() => navigation.navigate("Smodel")}
                >
                  <Text style={styles.text}>
                    Size=
                    {route.params.responseData
                      ? route.params.responseData.size
                      : ""}
                  </Text>
                </TouchableOpacity>
              </View> */}
            {/* <View style={styles.containerScroll}>
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {renderTINNumbers()}
                </ScrollView>
              </View> */}
          </View>
        )}
        <View
          style={{
            width: 180,
            height: 40,
            // top: 160,
            // borderRadius: 30,
            // borderWidth: 3,
            // borderColor: "#31367b",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: '#31367b',
          }}
          // onPress={() => navigation.navigate("Login")}
        >
          <Text
            style={{
              fontSize: 17,
              color: '#d9d9d9',
              letterSpacing: 1,
              fontWeight: 'bold',
            }}>
            Step-2
          </Text>
        </View>
        <Text
          style={{
            fontSize: 17,
            color: '#7f7f7f',
            textAlign: 'center',
            top: 5,
          }}>
          Select individual tyres and scan the TIN
        </Text>
        <TouchableOpacity
          style={{
            width: 220,
            height: 40,
            top: 15,

            borderRadius: 12,
            // borderWidth: 3,
            // borderColor: "#3758ff",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: '#3758ff',
          }}
          onPress={() => {
            if (
              // chasisRef.current.selectedButtonFFRight !== null ||
              // chasisRef.current.selectedButtonFRRight !== null ||
              // chasisRef.current.selectedButtonPARight !== null ||
              // chasisRef.current.selectedButtonRFRight !== null ||
              // chasisRef.current.selectedButtonRRRight !== null ||
              // chasisRef.current.selectedButtonTARight !== null ||
              // chasisRef.current.selectedButtonFFLeft !== null ||
              // chasisRef.current.selectedButtonFRLeft !== null ||
              // chasisRef.current.selectedButtonPALeft !== null ||
              // chasisRef.current.selectedButtonRFLeft !== null ||
              // chasisRef.current.selectedButtonRRLeft !== null ||
              // chasisRef.current.selectedButtonTALeft !== null
              selectedWheelData.wheel_id !== '' &&
              selectedWheelData.wheel_id !== null
            ) {
              if (
                selectedWheelData.wheel_tin === '' ||
                selectedWheelData.wheel_tin === null
              ) {
                const key = JSON.stringify(selectedWheelData); // Constructing unique key
                const numberOfFailedAttempts = failedAttempts[key] || 0; // Get the number of failed attempts for the selected tyre
                if (numberOfFailedAttempts >= 3) {
                  // If yes, prompt the user to choose between manual input and scanning
                  Alert.alert(
                    'Exceeded scan attempts',
                    'You have exceeded 3 scans for this tyre. Would you like to proceed with manual input?',
                    [
                      {
                        text: 'Proceed scanning again',
                        onPress: () => {
                          const timeOut = setTimeout(() => {
                            // Navigate to tyre scan screen
                            navigation.navigate('CameraScreen', {
                              model: apiResponseData,
                              // id: route.params.id,
                              vin: apiResponseData.vin,
                            });
                          }, 500);
                          timeOut();
                          handleFailedAttempt();
                          handleButtonPress();
                        },
                      },
                      {
                        text: 'Manual input',
                        onPress: () => {
                          // Navigate to manual input screen
                          // navigation.navigate("ManualInputScreen");
                          console.log('Manual input selected');
                          setManualModal(true);
                          console.log('Manual modal:', manualModal);
                        },
                      },
                    ],
                  );
                } else {
                  setTimeout(() => {
                    // Navigate to tyre scan screen
                    navigation.navigate('CameraScreen', {
                      model: apiResponseData,
                      // id: route.params.id,
                      vin: apiResponseData.vin,
                    });
                  }, 600);
                  handleFailedAttempt();
                  handleButtonPress();
                }
              } else {
                Alert.alert(
                  'Alert',
                  'Wheel already scanned, do you want to scan again?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Scan',
                      onPress: () => {
                        const key = JSON.stringify(selectedWheelData); // Constructing unique key
                        const numberOfFailedAttempts = failedAttempts[key] || 0; // Get the number of failed attempts for the selected tyre
                        if (numberOfFailedAttempts >= 3) {
                          // If yes, prompt the user to choose between manual input and scanning
                          Alert.alert(
                            'Exceeded scan attempts',
                            'You have exceeded 3 scans for this tyre. Would you like to proceed with manual input?',
                            [
                              {
                                text: 'Proceed scanning again',
                                onPress: () => {
                                  // Navigate to tyre scan screen
                                  navigation.navigate('CameraScreen', {
                                    model: apiResponseData,
                                    // id: route.params.id,
                                    vin: apiResponseData.vin,
                                  });
                                  handleFailedAttempt();
                                  handleButtonPress();
                                },
                              },
                              {
                                text: 'Manual Input',
                                onPress: () => {
                                  // Navigate to manual input screen
                                  // navigation.navigate("ManualInputScreen");
                                  console.log('Manual input selected');
                                  setManualModal(!manualModal);
                                  console.log('Manual modal:', manualModal);
                                },
                              },
                            ],
                          );
                        } else {
                          navigation.navigate('CameraScreen', {
                            model: apiResponseData,
                            // id: route.params.id,
                            vin: apiResponseData.vin,
                          });
                          handleFailedAttempt();
                          handleButtonPress();
                        }
                      },
                    },
                  ],
                );
              }
            } else {
              Alert.alert(
                'Alert',
                'No wheel selected, select wheel to perform scan',
              );
            }
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17}}>
            Scan the TIN
          </Text>
        </TouchableOpacity>
        <View
          style={{
            margin: 20,
            marginBottom: 5,
            top: 15,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '90%',
            height: 40,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: '#3758ff',
            //   justifyContent: "center",
            alignItems: 'center',
            //   zIndex: 2,
          }}>
          <Image
            source={logoTyre2}
            style={{
              resizeMode: 'contain',
              height: 28,
              width: 28,
              right: 30,
            }}></Image>
          <View>
            <TextInput
              placeholder={globalTin ? globalTin : 'Scanned TIN no.'}
              placeholderTextColor="grey"
              style={{
                height: 40,
                width: 180,
                right: 60,
                fontSize: 15,
                color: 'black',
              }}
            />
          </View>
        </View>
      </View>
      <Tabs
        left={dash}
        center={logoKGP2}
        right={logout}
        tabLeftFunc={() => navigation.navigate('Dashboard')}
        tabRightFunc={handleLogout}
      />
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleDropdown}>
        <View style={styles.dropdown}>
          <View
            style={{
              flexDirection: 'row',
              // backgroundColor: "red",
              width: 180,
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1.5,
              borderColor: '#31367b',
            }}>
            <View>
              <Text style={{fontWeight: 'bold', fontSize: 15, color: 'black'}}>
                Settings
              </Text>
            </View>
            <TouchableOpacity onPress={toggleDropdown}>
              <Image
                source={close}
                style={{
                  resizeMode: 'contain',
                  height: 28,
                  width: 28,
                }}></Image>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              enableRescan ? styles.buttonEnabled : styles.buttonDisabled,
            ]}
            onPress={() => {
              setEnableRescan(!enableRescan);
              dispatch(
                setSelectedWheelDataGlobal({
                  axle_location: '',
                  // axle_id: axle_id,
                  wheel_pos: '',
                  wheel_id: '',
                  wheel_tin: '',
                }),
              );
              toggleDropdown();
            }}>
            <Text style={styles.buttonText}>
              {enableRescan ? 'Disable Rescan' : 'Enable Rescan'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={manualModal}
        onRequestClose={() => setManualModal(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            // backgroundColor: "red",
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              elevation: 5,
              justifyContent: 'center',
              alignItems: 'center',
              width: '80%',

              minHeight: 260,
              height: '35%',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: 'black',
              }}>
              Enter TIN
            </Text>

            <View
              style={{
                margin: 20,
                marginBottom: 5,
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
              }}
              // onPress={() => navigation.navigate("Vmodel")}
            >
              {/* <Image
                  source={id}
                  style={{ resizeMode: "contain", height: 30, width: 30 }}
                ></Image> */}
              <View>
                <TextInput
                  placeholder="TIN no."
                  placeholderTextColor="grey"
                  style={{height: 40, width: 180, color: 'black'}}
                  value={manualTIN}
                  onChangeText={text => setManualTIN(text)}
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
              onPress={putData}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 17,
                  letterSpacing: 1,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Smodel;

const styles = StyleSheet.create({
  container1: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    bottom: 60,

    // marginBottom:0
    // backgroundColor:"black"
  },
  container2: {
    height: 140,
    width: 400,
    marginTop: 0,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"black"
  },
  container3: {
    height: 100,
    width: 400,
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '34%',
    height: '30%',
    backgroundColor: '#7f6000',
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn2: {
    width: '34%',
    height: '20%',
    backgroundColor: '#222a35',
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn3: {
    width: '19%',
    height: '20%',
    backgroundColor: '#222a35',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  textScroll: {
    fontSize: 45,
    flex: 1,
  },
  containerScroll: {
    // flex: 1,
    height: 260,
    // paddingTop: StatusBar.currentHeight,
  },
  dropdown: {
    position: 'absolute',
    top: 30,
    right: 1,
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 10,
    elevation: 3,
    height: 100,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50', // Green color for enabled button
    paddingVertical: 5,
    paddingHorizontal: 24,
    borderRadius: 5,
    elevation: 3, // Elevation for Android shadow
    top: 10,
  },
  buttonEnabled: {
    backgroundColor: '#4CAF50', // Green color for enabled button
  },
  buttonDisabled: {
    backgroundColor: '#9E9E9E', // Grey color for disabled button
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF', // White text color
  },
});
