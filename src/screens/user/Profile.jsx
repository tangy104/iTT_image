import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ImageBackground,
  TextInput,
  useWindowDimensions,
  ScrollView,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {DataTable} from 'react-native-paper';
import DatePicker from 'react-native-modern-datepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {setTokenGlobal} from '../../state/tokenslice';
import {setCreden} from '../../state/credenSlice';

import Tabs from '../../navigation/Tabs';

import image from '../../utils/images/light.png';
import backgroundImage from '../../utils/images/backgroundImage.png';
import backgroundImage2 from '../../utils/images/backgroundImage2.png';
import logoTATA from '../../utils/images/logoTATA.png';
import logoTATA3 from '../../utils/images/logoTATA3.png';
import logoApp from '../../utils/images/logoApp.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import Profile from '../../utils/images/profile.png';
import doc from '../../utils/images/doc.png';
import question from '../../utils/images/question.png';
import back from '../../utils/images/back.png';
import profileEdit from '../../utils/images/profileEdit.png';
import logoTATA2 from '../../utils/images/logoTATA2.png';
import pencil from '../../utils/images/pencil.png';
import iTTText from '../../utils/images/iTTText.png';
import calendar from '../../utils/images/calendar.png';

// import GoodVibes from "../../../assets/fonts/GreatVibes-Regular.ttf";
import {URI} from '@env';

// const windowWidth = useWindowDimensions().width;

// const validationSchema = Yup.object().shape({
//   // email: Yup.string().email("Invalid email").required("Email is required"),
//   email: Yup.string().required('Email is required'),
//   password: Yup.string().required('Password is required'),
// });

const Home = ({navigation}) => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    // console.log('Current date:', `${year}/${month}/${day}`);
    return `${year}/${month}/${day}`;
  };

  // const getTomorrowDate = () => {
  //   const today = new Date();
  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(today.getDate() + 1);
  //   const year = tomorrow.getFullYear();
  //   const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  //   const day = String(tomorrow.getDate()).padStart(2, '0');
  //   return `${year}/${month}/${day}`;
  // };

  const {height, width} = useWindowDimensions();
  const [data, setData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [isCalenderVisible, setIsCalenderVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [totalTinCount, setTotalTinCount] = useState(0);
  const [uniqueVinCount, setUniqueVinCount] = useState(0);

  //   const [fontsLoaded] = useFonts({
  //     allura,
  //     Allura_400Regular,
  //   });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  const dispatch = useDispatch();
  const globalToken = useSelector(state => state.token.tokenGlobal);
  const creden = useSelector(state => state.creden.creden);

  const endpoint = creden.URI + '/whoami/';

  // Function to make the POST request
  const makeRequest = async () => {
    try {
      const response = await axios.post(
        endpoint,
        {},
        {
          params: {
            token: globalToken,
          },
          headers: {
            Accept: 'application/json',
            // Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Response:', response.data);
      setData(response.data);
      console.log('Data:', data);
      // console.log("photo path:", `${URI + data.photo_path}`);
    } catch (error) {
      //Handle the error response
      if (error.response && error.response.status === 403) {
        console.error(error.response.data.detail);
        async () => {
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
            console.log('Logout successful', response.data);
          } catch (error) {
            console.error('Error logging out', error);
          }
        },
          // Show an alert and navigate to the login page
          Alert.alert(
            'Invalid Credentials',
            'Your shift has ended. Please log in again to continue.',
            [
              {
                text: 'OK',
                onPress: () =>
                  navigation.navigate('LoginNav', {screen: 'Login'}), // Navigate to the login page
              },
            ],
            {cancelable: false},
          );
      } else {
        console.error('Error fetching data from profile:', error);
      }
    }
  };

  const updateProfile = async () => {
    if (!firstname || !lastname) {
      Alert.alert('Alert', 'Please enter your first and last name');
      return;
    }
    const ticket = await AsyncStorage.getItem('ticket');
    try {
      const response = await axios.put(
        `${creden.URI + '/user_update/'}`,
        {
          ticket_no: ticket,
          first_name: firstname,
          last_name: lastname,
        },
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('profile updated', response.data);
      setIsModalVisible(false);
      setFirstname('');
      setLastname('');
      makeRequest();
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  //Fetch list of all the tin and vin scanned by the user
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await AsyncStorage.getItem('ticket');
  //     try {
  //       const response = await axios.get(
  //         `${creden.URI}/records_query/wheel_record_last_edited_by/`,
  //         {
  //           params: {
  //             query: data,
  //             token: globalToken,
  //           },
  //           headers: {
  //             accept: 'application/json',
  //           },
  //         },
  //       );
  //       console.log('Response last edited by:', response.data);
  //       const formattedData = response.data.cars.map(car => ({
  //         tin: car.axles_data.wheels_data.tin,
  //         vin: car.vin,
  //       }));
  //       console.log('Formatted data:', formattedData);
  //       setTableData(formattedData);
  //     } catch (error) {
  //       console.error('Error fetching data', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const BottomTabLeftFunc = () => {
  //   navigation.navigate('AboutCoEAMT');
  // };
  // const BottomTabRightFunc = () => {
  //   navigation.navigate('AboutApp');
  // };

  const filterDataByDate = (cars, date) => {
    // console.log('date', date);
    // const dateNumber = parseInt(date.replace(/-/g, '')); // Convert date to YYYYMMDD format and then to a number
    // Extract the year, month, and day parts from the date string
    const [year, month, day] = date.split('/');

    // Convert to YYYYMMDD format
    const dateNumber = parseInt(`${year}${month}${day}`);
    console.log('Date number:', dateNumber);
    return cars.filter(
      car => car.axles_data.wheels_data.scn_compound === dateNumber,
    );
  };

  const fetchDataForSelectedDate = async selectedDate => {
    const ticket = await AsyncStorage.getItem('ticket');
    try {
      const response = await axios.get(
        `${creden.URI}/records_query/wheel_record_last_edited_by/`,
        {
          params: {
            query: ticket,
            token: globalToken,
          },
          headers: {
            accept: 'application/json',
          },
        },
      );
      console.log('Response for selected date:', response.data);
      const filteredData = filterDataByDate(response.data.cars, selectedDate);
      const formattedData = filteredData.map(car => ({
        tin: car.axles_data.wheels_data.tin,
        vin: car.vin,
      }));

      // Calculate total number of TINs and unique VINs
      const totalTinCount = formattedData.length;
      const uniqueVinCount = new Set(formattedData.map(item => item.vin)).size;

      setTableData(formattedData);
      setTotalTinCount(totalTinCount);
      setUniqueVinCount(uniqueVinCount);

      console.log('Formatted data:', formattedData);
      console.log('Total TIN count:', totalTinCount);
      console.log('Unique VIN count:', uniqueVinCount);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleDateChange = date => {
    console.log('Selected date:', date);
    setSelectedDate(date);
    setIsCalenderVisible(false);
    fetchDataForSelectedDate(date);
  };

  useEffect(() => {
    // Call the function to make the request
    makeRequest();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchDataForSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar />

      <View style={styles.linearGradient}>
        <ImageBackground
          source={backgroundImage2}
          style={styles.imageBackground}>
          <View
            style={{
              // flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 100,
              width: '100%',
              // backgroundColor: "#31367b",
              // backgroundColor: 'red',
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
              onPress={() => navigation.goBack()}>
              <Image
                source={back}
                style={{resizeMode: 'contain', width: 26, height: 27}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '33%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                right: width / 3, //repeat this step
                alignSelf: 'center',
                top: 50,
              }}
              // onPress={() => navigation.navigate("Profile")}
              //   onPress={() => navigation.navigate('Login')}
            >
              <Image
                source={logoApp}
                style={{
                  resizeMode: 'contain',
                  width: 100,
                  height: 90,
                }}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                width: '33%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('AboutApp')}>
              <Image source={question} style={{width: 25, height: 23}} />
            </TouchableOpacity> */}
          </View>

          {/* <Animated.Text
            entering={FadeInUp.delay(200).duration(1000).springify()}
            style={styles.text1}>
            User profile
          </Animated.Text> */}
          <Image
            source={iTTText}
            style={{resizeMode: 'contain', width: 250, top: 12}}
          />
          <Text style={styles.text1}> User profile</Text>
          <View
            style={{
              height: 150,
              width: 150,
              borderRadius: 100,
              borderWidth: 3,
              borderColor: '#d9d9d9',
              top: 30,
              backgroundColor: '#3758ff',
              // backgroundColor: '#990000',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{position: 'absolute', left: 120, top: 10}}
              onPress={() => setIsModalVisible(!isModalVisible)}>
              <Image source={pencil} />
            </TouchableOpacity>

            <Image
              source={
                data && data.photo_path
                  ? {uri: `${creden.URI + data.photo_path}`}
                  : profileEdit
              }
              style={{
                resizeMode: 'cover',
                flex: data && data.photo_path ? 1 : 0,
                zIndex: -1,
                borderRadius: 100,
                width: data && data.photo_path ? 144 : 80,
                height: data && data.photo_path ? 144 : 80,
              }}
            />
          </View>

          {/* <Animated.Text
              entering={FadeInUp.delay(400).duration(1000).springify()}
              style={styles.text2}
            >
              Intelligent Tyre Tracer
            </Animated.Text> */}
          {/* <Text style={{ fontFamily: "Allura_400Regular", fontSize: 25, color: "#fff" }}> */}

          <Text style={{fontSize: 30, top: 30, color: 'black'}}>
            {data && data.first_name && data.last_name
              ? data.first_name + ' ' + data.last_name
              : 'Username not available'}
          </Text>
          <View
            style={{
              top: 30,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  letterSpacing: 0.8,
                  color: '#31367b',
                  fontWeight: 'bold',
                }}>
                Email:
              </Text>
              <Text style={{fontSize: 17, color: '#7f7f7f'}}>
                {' '}
                {data && data.email ? data.email : 'Email not available'}
              </Text>
            </View> */}
            <View
              style={{
                top: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  letterSpacing: 0.8,
                  color: '#31367b',
                  fontWeight: 'bold',
                }}>
                Ticket no.:
              </Text>
              <Text style={{fontSize: 17, color: '#7f7f7f'}}>
                {' '}
                {data ? data.ticket_no : ''}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 30,
              // backgroundColor: 'red',
              width: '100%',
              height: 200,
              top: 60,
              alignItems: 'center',
            }}>
            {/* <ScrollView style={styles.container}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title sortDirection="descending">
                  TIN
                </DataTable.Title>
                <DataTable.Title>VIN</DataTable.Title>
              </DataTable.Header>
              {tableData.map((row, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{row.tin}</DataTable.Cell>
                  <DataTable.Cell>{row.vin}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView> */}
            <View
              style={{
                flex: 1,
                width: '90%',
                padding: 10,
                backgroundColor: '#3758ff',
                // justifyContent: 'center',
                // alignItems: 'center',
                borderRadius: 15,
                // height: 300,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: 'black',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 20,
                    alignSelf: 'center',
                    textDecorationLine: 'underline',
                    left: 15,
                  }}>
                  ACTIVITY LOG
                </Text>
                <TouchableOpacity
                  style={{
                    // postition: 'absolute',
                    zIndex: 1,
                    // backgroundColor: 'red',
                    left: 80,
                  }}
                  onPress={() => setIsCalenderVisible(!isCalenderVisible)}>
                  <Image
                    style={{
                      resizeMode: 'contain',
                      height: 30,
                      width: 30,
                      // left: 10,
                    }}
                    source={calendar}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  // backgroundColor: 'red',
                  borderBottomColor: '#fff',
                  borderBottomWidth: 2,
                }}>
                {/* <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 12,
                    alignSelf: 'flex-end',
                  }}>
                  as on 
                </Text> */}
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 12,
                    alignSelf: 'flex-start',
                  }}>
                  {selectedDate === getCurrentDate() ? 'TODAY' : selectedDate}
                </Text>
              </View>

              {tableData?.length > 0 ? (
                <>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderWidth: 1,
                      borderColor: '#fff',
                      padding: 2,
                      height: 30,
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                      Total tyres scanned:
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#fff',
                      }}>
                      {totalTinCount}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        borderLeftWidth: 1,
                        borderLeftColor: '#fff',
                        paddingLeft: 5,
                      }}>
                      Total vehicles scanned:
                    </Text>
                    <Text
                      style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>
                      {uniqueVinCount}
                    </Text>
                  </View>
                  <View
                    style={{
                      // backgroundColor: 'red',
                      marginTop: 10,
                      padding: 4,
                      borderWidth: 0.5,
                      borderColor: '#fff',
                      height: 85,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#c8e1ff',
                        paddingBottom: 8,
                        marginBottom: 8,
                        // marginTop: 10,
                        // backgroundColor: '#0f103e',
                      }}>
                      {/* <Text
                        style={{
                          flex: 1,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          fontSize: 13,
                        }}>
                        Sl no.
                      </Text> */}
                      <Text
                        style={{
                          flex: 4,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        Last scanned TIN
                      </Text>
                      <Text
                        style={{
                          flex: 4,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        Last scanned VIN
                      </Text>
                    </View>
                    <FlatList
                      // data={tableData}
                      data={tableData.slice(0, 1)}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item, index}) => (
                        <View
                          style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: '#c8e1ff',
                            paddingVertical: 8,
                          }}>
                          {/* <Text style={{flex: 1, textAlign: 'left'}}>
                            {index + 1}
                          </Text> */}
                          <Text
                            style={{
                              flex: 6,
                              textAlign: 'center',
                              // marginLeft: 7,
                              fontSize: 13,
                              color: '#fff',
                            }}>
                            {item.tin}
                          </Text>
                          <Text
                            style={{
                              flex: 6,
                              textAlign: 'center',
                              fontSize: 13,
                              color: '#fff',
                            }}>
                            {item.vin}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                </>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 20}}>
                    No recorded activity
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
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
              Enter details
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
                // borderColor: '#3758ff',
                borderColor: '#0f113e',
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
                  placeholder="First name"
                  placeholderTextColor="grey"
                  style={{height: 40, width: 180, color: 'black'}}
                  value={firstname}
                  onChangeText={text => setFirstname(text)}
                />
              </View>
            </View>
            <View
              style={{
                margin: 10,
                marginBottom: 5,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: 220,
                height: 40,
                // top: 160,
                borderRadius: 12,
                borderWidth: 1.5,
                // borderColor: '#3758ff',
                borderColor: '#0f113e',
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
                  placeholder="Last name"
                  placeholderTextColor="grey"
                  style={{height: 40, width: 180, color: 'black'}}
                  value={lastname}
                  onChangeText={text => setLastname(text)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{
                width: 190,
                height: 40,
                marginTop: 25,
                borderRadius: 12,
                // borderWidth: 3,
                // borderColor: "#3758ff",
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                // backgroundColor: '#3758ff',
                backgroundColor: 'darkgreen',
              }}
              onPress={updateProfile}>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCalenderVisible}>
        <View
          style={{
            flex: 1,
            // backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              width: '90%',
              padding: 35,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <DatePicker
              mode="calender"
              selected={selectedDate}
              onDateChange={handleDateChange}
              current={selectedDate}
              maximumDate={getCurrentDate()}
            />
          </View>
        </View>
      </Modal>
      <Tabs
        // left={doc}
        center={logoKGP2}
        right={doc}
        // tabLeftFunc={BottomTabLeftFunc}
        // tabRightFunc={BottomTabRightFunc}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    // backgroundColor: "#ffc0c8",
    // backgroundColor: "#ffe9ec",
  },
  container: {
    // height: '20%',
    // flex: 1,
    // padding: 16,
    // backgroundColor: 'red',
  },

  linearGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 5,
    // height: 100,
    // width: 350,
  },
  imageBackground: {
    flex: 1,
    // backgroundColor:"red",
    // resizeMode: "cover",
    width: '100%',
    height: '55%',
    alignItems: 'center',
    // justifyContent: "center",
  },
  text1: {
    // position: "absolute",
    top: 25,
    color: '#d9d9d9',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 3,
    // flex:1,
  },
  text2: {
    // position: "absolute",
    top: 60,
    // left: 22,
    color: '#fff',
    fontSize: 20,
    // fontWeight: "bold",
    fontFamily: 'Allura_400Regular',
    fontStyle: 'italic',
    // flex:1,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
    // flex:1,
  },
  btn: {
    position: 'absolute',
    // top: 360,
    // left: 135,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 3,
    borderRadius: 30,
    // borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "rgba(0, 0, 0, 0.1)",
    height: 50,
    width: 120,
    // margin: 100,
    // flex:1
  },
  image: {
    position: 'absolute',
    paddingRight: 5,
    top: 0,
    left: '75%',
    height: 200,
    // height: "30%",
    width: 80,
    // width: "20%",
  },
  input1: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 300,
    width: '90%',
    height: 30,
    borderRadius: 20,
  },
  input2: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 20,
    width: '90%',
    height: 30,
    borderRadius: 20,
  },
  loginView: {
    backgroundColor: '#3758ff',
    // backgroundColor: "rgba(255,140,97,1)",
    marginTop: 20,
    width: '90%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  loginBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  ptext: {
    margin: 0,
    paddingLeft: 15,
  },
  logInText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
  },
});
