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
import {s, vs, ms, ScaledSheet} from 'react-native-size-matters';

const Home = ({navigation, route}) => {
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
        const response = await axios.get(`${creden.URI + '/all_users/'}`, {
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
      const response = await axios.get(`${creden.URI + '/all_users/'}`, {
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

  // Posting by axios
  const handleLogin = async values => {
    try {
      if (!values.email || !values.password) {
        alert('Please enter both email and password.');
        return;
      }
      const serializedValues = JSON.parse(JSON.stringify(values));

      const formData = new URLSearchParams();
      formData.append('grant_type', '');
      formData.append('username', 'lemon');
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

      const token = response.data.access_token;
      dispatch(setTokenGlobal(token));

      console.log('Login successful! token:', globalToken);

      navigation.navigate('Vmodel');
    } catch (error) {
      console.error('Error during login:', error.message);
      if (error.response && error.response.status === 401) {
        alert('Invalid username or password. Please try again.');
      } else {
        alert('Invalid credentials. Please try again.');
      }
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
              console.log('Logout successful', response.data);
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
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Response:', response.data);
      Alert.alert('Ticket added successfully');
      setTicketNo('');
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', 'Ticket number already exists');
        setTicketNo('');
      } else {
        console.error('Error:', error);
        Alert.alert('Network error', 'Please check your connection');
        setTicketNo('');
      }
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
        <Text style={styles.infoText}>Manage the access of the users</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}>
          <Text style={styles.text}>Add new Ticket</Text>
        </TouchableOpacity>
        <Image source={logoTyre} style={styles.logoTyre} />
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>List of the current Tickets</Text>
        </View>
        <View style={styles.container}>
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
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Ticket</Text>

            <View style={styles.inputContainer}>
              <Image
                source={id}
                style={{resizeMode: 'contain', height: vs(25), width: s(24)}}
              />
              <TextInput
                placeholder="Ticket no."
                placeholderTextColor="grey"
                style={styles.input}
                value={ticketNo}
                onChangeText={text => setTicketNo(text)}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={addTicket}>
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

const styles = ScaledSheet.create({
  safeContainer: {
    flex: 1,
  },

  linearGradient: {
    flex: 1,
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  infoText: {
    fontSize: ms(17),
    color: '#7f7f7f',
    textAlign: 'center',
    margin: s(10),
  },
  addButton: {
    width: s(200),
    height: vs(35),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: '#3758ff',
  },
  logoTyre: {
    resizeMode: 'contain',
    height: vs(150),
  },
  listHeader: {
    width: s(200),
    height: vs(50),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: '#31367b',
  },
  listHeaderText: {
    color: '#fff',
    fontSize: ms(17),
    letterSpacing: ms(1.5),
    textAlign: 'center',
  },
  container: {
    marginTop: vs(15),
    marginLeft: s(10),
    marginRight: s(10),
    borderRadius: s(10),
    padding: s(10),
    width: '95%',
    height: '44%',
    // backgroundColor: 'red',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'red',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  cell: {
    display: 'flex',
    flex: 1,
    // height: vs(30),
    textAlign: 'center',
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: s(7),
    //  backgroundColor: 'red',
    color: 'black',
    borderWidth: 1,
  },
  serialCell: {
    flex: 0.5,
    display: 'flex',
    fontSize: ms(13),
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  headerCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    backgroundColor: '#646fff',
    borderWidth: 1,
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    marginTop: s(4),
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: s(20),
    borderRadius: s(10),
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    minHeight: vs(260),
    height: '35%',
  },
  modalTitle: {
    fontSize: ms(18),
    fontWeight: 'bold',
    marginBottom: s(10),
    color: 'black',
  },
  modalInputContainer: {
    margin: s(20),
    marginBottom: s(10),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  modalImage: {
    width: s(20),
    height: vs(20),
    marginRight: s(10),
  },
  modalInput: {
    flex: 1,
    height: vs(40),
    fontSize: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
  },
  submitButton: {
    width: s(150),
    height: vs(40),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3758ff',
  },
  text: {
    color: '#fff',
    fontSize: ms(16),
  },
  inputContainer: {
    width: '196@s',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '20@vs',
    borderWidth: 1.5,
    borderColor: '#3758ff',
    borderColor: '#0f113e',
    borderRadius: '12@ms',
    paddingHorizontal: '10@s',
    backgroundColor: 'white',
    top: '20@vs',
    marginBottom: '30@vs',
    // backgroundColor:"red"
  },
  input: {
    flex: 1,
    height: '45@vs',
    top: '3@vs',
    paddingHorizontal: '6@s',
    color: 'black',
    // backgroundColor: 'red',
  },
});
