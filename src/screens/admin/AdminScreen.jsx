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
  FlatList,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {setTokenGlobal} from '../../state/tokenslice';

import Tabs from '../../navigation/Tabs';
import TopTabs from '../../navigation/TopTabs';

import image from '../../utils/images/light.png';
import backgroundImage from '../../utils/images/backgroundImage.png';
import logoTATA2 from '../../utils/images/logoTATA2.png';
import logoApp from '../../utils/images/logoApp.png';
import logoKGP2 from '../../utils/images/logoKGP2.png';
import id from '../../utils/images/id.png';
import dash from '../../utils/images/dash.png';
import logout from '../../utils/images/logout.png';
import logoTyre from '../../utils/images/logoTyre.png';
import question from '../../utils/images/question.png';
import back from '../../utils/images/back.png';
import doc from '../../utils/images/doc.png';

// import GoodVibes from "../../../assets/fonts/GreatVibes-Regular.ttf";
import {URI} from '@env';

// const windowWidth = useWindowDimensions().width;

const Home = ({navigation, route}) => {
  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  const dispatch = useDispatch();
  const globalToken = useSelector(state => state.token.tokenGlobal);
  const creden = useSelector(state => state.creden.creden);

  console.log('URI:', URI);

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ticketNo, setTicketNo] = useState('');

  useEffect(() => {
    console.log('password:', route.params.password);
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${creden.URI + '/users/'}`, {
          headers: {
            accept: 'application/json',
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${creden.URI + '/users/'}`, {
        headers: {
          accept: 'application/json',
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const renderUser = ({item, index}) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.serialCell]}>{index + 1}</Text>
      <Text style={styles.cell}>{item.ticket_no}</Text>
      <Text style={styles.cell}>{item.first_name || 'NA'}</Text>
      <Text style={styles.cell}>{item.last_name || 'NA'}</Text>
      <Text style={styles.cell}>{item.email || 'NA'}</Text>
    </View>
  );

  //posting by axios
  const handleLogin = async values => {
    try {
      // Check if email and password are provided
      if (!values.email || !values.password) {
        // Show an alert if either email or password is missing
        alert('Please enter both email and password.');
        return;
      }
      // Serialize the values object to plain JavaScript object
      const serializedValues = JSON.parse(JSON.stringify(values));

      const formData = new URLSearchParams();
      formData.append('grant_type', '');
      // formData.append("username", values.email);
      formData.append('username', 'lemon');
      // formData.append("password", values.password);
      formData.append('password', 'tangy');
      formData.append('scope', '');
      formData.append('client_id', '');
      formData.append('client_secret', '');

      console.log('Login Information:', formData);

      const response = await axios.post(
        creden.URI + '/login/',
        formData.toString(),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // Assuming the server responds with a token
      const token = response.data.access_token;
      dispatch(setTokenGlobal(token));

      // Handle the token as needed (e.g., store it in a secure location)
      console.log('Login successful! token:', globalToken);

      // Navigate to the next screen after successful login
      navigation.navigate('Vmodel');
    } catch (error) {
      console.error('Error during login:', error.message);
      // Check if the error is due to invalid credentials (unauthorized)
      if (error.response && error.response.status === 401) {
        alert('Invalid username or password. Please try again.');
      } else {
        // Handle other types of errors as needed
        alert('Invalid credentials. Please try again.');
      }
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  // const handleLogin = (values) => {
  //   try {

  // // Check if email and password are provided
  // if (!values.email || !values.password) {
  //   // Show an alert if either email or password is missing
  //   alert("Please enter both email and password.");
  //   return;
  // }
  //     // Log the extracted login information to the console
  //     console.log("Login Information:", values);

  //     // Navigate to the next screen after successful login
  //     navigation.navigate("Vmodel");
  //   } catch (error) {
  //     console.error("Error during login:", error.message);
  //     // Handle the error as needed (e.g., show an error message to the user)
  //   }
  // };

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

  const addTicket = async () => {
    if (!ticketNo) {
      Alert.alert('Please enter a ticket number');
      return;
    }
    console.log(
      'urladmin:',
      `${creden.URI + '/signup/?admin_password=' + route.params.password}`,
    );
    try {
      const response = await axios.post(
        `${creden.URI + '/signup/?admin_password=' + route.params.password}`,
        {
          ticket_no: ticketNo,
          blocked: 'false',
        },
        {
          headers: {
            // Accept: "application/json",
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Response:', response.data);
      Alert.alert('Ticket added successfully');
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      // Handle error as needed
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar />
      <TopTabs
        left={back}
        center={logoApp}
        right={question}
        tabLeftFunc={() => navigation.goBack()}
        tabRightFunc={() => navigation.navigate('AboutApp')}
      />

      <View style={styles.linearGradient}>
        <Text
          style={{
            fontSize: 17,
            color: '#7f7f7f',
            textAlign: 'center',
            margin: 10,
          }}>
          Manage the access of the users
        </Text>
        <TouchableOpacity
          style={{
            width: 220,
            height: 40,
            // top: 10,
            borderRadius: 12,
            // borderWidth: 3,
            // borderColor: "#3758ff",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: '#3758ff',
          }}
          onPress={() => setShowModal(true)}>
          <Text style={styles.text}>Add new Ticket</Text>
        </TouchableOpacity>
        <Image
          source={logoTyre}
          style={{
            resizeMode: 'contain',
            // backgroundColor: "red",
            height: 160,
            // bottom: 60,
            //   width: 80
          }}></Image>
        <View
          style={{
            width: 200,
            height: 50,
            // borderRadius: 30,
            // borderWidth: 3,
            // borderColor: "#31367b",
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: '#31367b',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 17,
              letterSpacing: 1.5,
              textAlign: 'center',
              //   justifyContent: "center",
              //   alignItems: "center",
            }}>
            List of the current Tickets
          </Text>
        </View>
        <View
          style={{
            // flex: 1,
            marginTop: 20,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 10,
            padding: 10,
            width: '95%',
            height: '42%',
            // backgroundColor: "red",
          }}>
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.serialCell, styles.headerCell]}>
              SNo
            </Text>
            <Text style={[styles.cell, styles.headerCell]}>Ticket No</Text>
            <Text style={[styles.cell, styles.headerCell]}>First Name</Text>
            <Text style={[styles.cell, styles.headerCell]}>Last Name</Text>
            <Text style={[styles.cell, styles.headerCell]}>Email</Text>
          </View>
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={item => item.ticket_no.toString()}
          />
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
              Add Ticket
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
              onPress={() => navigation.navigate('Vmodel')}>
              <Image
                source={id}
                style={{resizeMode: 'contain', height: 30, width: 30}}></Image>
              <View>
                <TextInput
                  placeholder="Ticket no."
                  placeholderTextColor="grey"
                  style={{height: 40, width: 180, color: 'black'}}
                  value={ticketNo}
                  onChangeText={text => setTicketNo(text)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{
                width: 190,
                height: 40,
                top: 16,
                borderRadius: 12,
                // borderWidth: 3,
                // borderColor: "#3758ff",
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                backgroundColor: '#3758ff',
              }}
              onPress={addTicket}>
              <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Tabs
        left={dash}
        center={logoTATA2}
        right={doc}
        tabRightFunc={() => navigation.navigate('AboutCoEAMT')}
        tabLeftFunc={() => navigation.navigate('Dashboard')}
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

  linearGradient: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: "center",
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
    top: 70,
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

  container: {
    flex: 1,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    width: '95%',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
    backgroundColor: '#f1f8ff',
    justifyContent: 'center',
    // alignItems: "center",
    // height: 80,
    // backgroundColor: "#656fff",
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'center',
    // alignItems: "center",
    // height: 50,
  },
  cell: {
    flex: 2,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    textAlignVertical: 'center',
    color: 'black',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#656fff',
  },
  serialCell: {
    flex: 1, // Smaller flex for serial number column
  },
});
