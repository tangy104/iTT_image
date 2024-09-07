import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {React, useState, useEffect} from 'react';
import {ScaledSheet, s, vs, ms} from 'react-native-size-matters';
// import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedWheelDataGlobal} from '../../state/selectSlice';
import {setTinGlobal} from '../../state/tinslice';
import {setCreden} from '../../state/credenSlice';

import chassis from '../../utils/images/chassis.jpg';
import chassis2 from '../../utils/images/chassis2.png';

// import STyre from './STyre';
import SAxle from './SAxle';
import {URI, WS_URI} from '@env';

// import { TouchableOpacity } from "react-native-web";

const Chasis = props => {
  // const route = useRoute();
  const dispatch = useDispatch();

  const selectedWheelDataGlobal = useSelector(
    state => state.app.selectedWheelDataGlobal,
  );
  const creden = useSelector(state => state.creden.creden);

  //For parallel comm
  const [selectedId, setSelectedId] = useState(null); // State to hold the selected ID of the current device
  const [selections, setSelections] = useState({}); // State to hold the selections of all devices
  const [otherSelections, setOtherSelections] = useState({}); //State to hold the selections of all the other devices
  const [selectedWheelDataKey, setSelectedWheelDataKey] = useState({}); //State to hold the selections of all the other devices
  const [ws, setWs] = useState(null); // State to hold the WebSocket instance

  const [showMessage, setShowMessage] = useState(false);

  const [selectedButtonFrontRight, setSelectedButtonFrontRight] =
    useState(null);
  const [selectedButtonRear1Right, setSelectedButtonRear1Right] =
    useState(null);
  const [selectedButtonSpare, setSelectedButtonSpare] = useState(null);
  const [selectedButtonFrontLeft, setSelectedButtonFrontLeft] = useState(null);
  const [selectedButtonRear1Left, setSelectedButtonRear1Left] = useState(null);
  const [selectedButtonRear2Left, setSelectedButtonRear2Left] = useState(null);

  //New 12 states
  const [selectedButtonFFRight, setSelectedButtonFFRight] = useState(null);
  const [selectedButtonFRRight, setSelectedButtonFRRight] = useState(null);
  const [selectedButtonPARight, setSelectedButtonPARight] = useState(null);
  const [selectedButtonRFRight, setSelectedButtonRFRight] = useState(null);
  const [selectedButtonRRRight, setSelectedButtonRRRight] = useState(null);
  const [selectedButtonTARight, setSelectedButtonTARight] = useState(null);

  const [selectedButtonFFLeft, setSelectedButtonFFLeft] = useState(null);
  const [selectedButtonFRLeft, setSelectedButtonFRLeft] = useState(null);
  const [selectedButtonPALeft, setSelectedButtonPALeft] = useState(null);
  const [selectedButtonRFLeft, setSelectedButtonRFLeft] = useState(null);
  const [selectedButtonRRLeft, setSelectedButtonRRLeft] = useState(null);
  const [selectedButtonTALeft, setSelectedButtonTALeft] = useState(null);

  //Redundant states for index states
  const [indexRecordFrontRight, setIndexRecordFrontRight] = useState([]);
  const [indexRecordFrontLeft, setIndexRecordFrontLeft] = useState([]);
  const [indexRecordRear1Right, setIndexRecordRear1Right] = useState([]);
  const [indexRecordRear1Left, setIndexRecordRear1Left] = useState([]);
  const [indexRecordRear2Right, setIndexRecordRear2Right] = useState([]);
  const [indexRecordRear2Left, setIndexRecordRear2Left] = useState([]);

  //New 12 states selection
  const handleButtonPressFFRight = buttonIndex => {
    setSelectedButtonFFRight(buttonIndex);
    setSelectedButtonFRRight(null); // Reset front axle selection
    setSelectedButtonPARight(null); // Reset rear axle selection
    setSelectedButtonRFRight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonFFLeft(null);
    setSelectedButtonFRLeft(null);
    setSelectedButtonPALeft(null);
    setSelectedButtonRFLeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressFRRight = buttonIndex => {
    setSelectedButtonFRRight(buttonIndex);
    setSelectedButtonFFRight(null); // Reset front axle selection
    setSelectedButtonPARight(null); // Reset rear axle selection
    setSelectedButtonRFRight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonFFLeft(null);
    setSelectedButtonFRLeft(null);
    setSelectedButtonPALeft(null);
    setSelectedButtonRFLeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressPARight = buttonIndex => {
    setSelectedButtonPARight(buttonIndex);
    setSelectedButtonFFRight(null); // Reset front axle selection
    setSelectedButtonFRRight(null); // Reset rear axle selection
    setSelectedButtonRFRight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonFFLeft(null);
    setSelectedButtonFRLeft(null);
    setSelectedButtonPALeft(null);
    setSelectedButtonRFLeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressRFRight = buttonIndex => {
    setSelectedButtonRFRight(buttonIndex);
    setSelectedButtonFFRight(null); // Reset front axle selection
    setSelectedButtonFRRight(null); // Reset rear axle selection
    setSelectedButtonPARight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonFFLeft(null);
    setSelectedButtonFRLeft(null);
    setSelectedButtonPALeft(null);
    setSelectedButtonRFLeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressRRRight = buttonIndex => {
    setSelectedButtonRRRight(buttonIndex);
    setSelectedButtonFFRight(null); // Reset front axle selection
    setSelectedButtonFRRight(null); // Reset rear axle selection
    setSelectedButtonPARight(null);
    setSelectedButtonRFRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonFFLeft(null);
    setSelectedButtonFRLeft(null);
    setSelectedButtonPALeft(null);
    setSelectedButtonRFLeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressTARight = buttonIndex => {
    setSelectedButtonTARight(buttonIndex);
    setSelectedButtonFFRight(null); // Reset front axle selection
    setSelectedButtonFRRight(null); // Reset rear axle selection
    setSelectedButtonPARight(null);
    setSelectedButtonRFRight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonFFLeft(null);
    setSelectedButtonFRLeft(null);
    setSelectedButtonPALeft(null);
    setSelectedButtonRFLeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressFFLeft = buttonIndex => {
    setSelectedButtonFFLeft(buttonIndex);
    setSelectedButtonFRLeft(null); // Reset front axle selection
    setSelectedButtonPALeft(null); // Reset rear axle selection
    setSelectedButtonRFLeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonFFRight(null);
    setSelectedButtonFRRight(null);
    setSelectedButtonPARight(null);
    setSelectedButtonRFRight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressFRLeft = buttonIndex => {
    setSelectedButtonFRLeft(buttonIndex);
    setSelectedButtonFFLeft(null); // Reset front axle selection
    setSelectedButtonPALeft(null); // Reset rear axle selection
    setSelectedButtonRFLeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonFFRight(null);
    setSelectedButtonFRRight(null);
    setSelectedButtonPARight(null);
    setSelectedButtonRFRight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressPALeft = buttonIndex => {
    setSelectedButtonPALeft(buttonIndex);
    setSelectedButtonFFLeft(null); // Reset front axle selection
    setSelectedButtonFRLeft(null); // Reset rear axle selection
    setSelectedButtonRFLeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonFFRight(null);
    setSelectedButtonFRRight(null);
    setSelectedButtonPARight(null);
    setSelectedButtonRFRight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressRFLeft = buttonIndex => {
    setSelectedButtonRFLeft(buttonIndex);
    setSelectedButtonFFLeft(null); // Reset front axle selection
    setSelectedButtonFRLeft(null); // Reset rear axle selection
    setSelectedButtonPALeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonFFRight(null);
    setSelectedButtonFRRight(null);
    setSelectedButtonPARight(null);
    setSelectedButtonRFRight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressRRLeft = buttonIndex => {
    setSelectedButtonRRLeft(buttonIndex);
    setSelectedButtonFFLeft(null); // Reset front axle selection
    setSelectedButtonFRLeft(null); // Reset rear axle selection
    setSelectedButtonPALeft(null);
    setSelectedButtonRFLeft(null);
    setSelectedButtonTALeft(null);
    setSelectedButtonFFRight(null);
    setSelectedButtonFRRight(null);
    setSelectedButtonPARight(null);
    setSelectedButtonRFRight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonSpare(null);
  };

  const handleButtonPressTALeft = buttonIndex => {
    setSelectedButtonTALeft(buttonIndex);
    setSelectedButtonFFLeft(null); // Reset front axle selection
    setSelectedButtonFRLeft(null); // Reset rear axle selection
    setSelectedButtonPALeft(null);
    setSelectedButtonRFLeft(null);
    setSelectedButtonRRLeft(null);
    setSelectedButtonFFRight(null);
    setSelectedButtonFRRight(null);
    setSelectedButtonPARight(null);
    setSelectedButtonRFRight(null);
    setSelectedButtonRRRight(null);
    setSelectedButtonTARight(null);
    setSelectedButtonSpare(null);
  };

  // const handleButtonPressFrontRight = (buttonIndex) => {
  //   setSelectedButtonFrontRight(buttonIndex);
  //   setSelectedButtonRear1Right(null); // Reset rear axle selection
  //   setSelectedButtonSpare(null); // Reset rear axle selection
  //   setSelectedButtonFrontLeft(null);
  //   setSelectedButtonRear1Left(null);
  //   setSelectedButtonRear2Left(null);
  // };
  // const handleButtonPressFrontLeft = (buttonIndex) => {
  //   setSelectedButtonFrontLeft(buttonIndex);
  //   setSelectedButtonRear1Right(null); // Reset rear axle selection
  //   setSelectedButtonSpare(null); // Reset rear axle selection
  //   setSelectedButtonFrontRight(null);
  //   setSelectedButtonRear1Left(null);
  //   setSelectedButtonRear2Left(null);
  // };

  // const handleButtonPressRear1Right = (buttonIndex) => {
  //   setSelectedButtonRear1Right(buttonIndex);
  //   setSelectedButtonFrontLeft(null); // Reset front axle selection
  //   setSelectedButtonSpare(null); // Reset rear axle selection
  //   setSelectedButtonFrontRight(null);
  //   setSelectedButtonRear1Left(null);
  //   setSelectedButtonRear2Left(null);
  // };
  // const handleButtonPressRear1Left = (buttonIndex) => {
  //   setSelectedButtonRear1Right(null);
  //   setSelectedButtonFrontLeft(null); // Reset front axle selection
  //   setSelectedButtonSpare(null); // Reset rear axle selection
  //   setSelectedButtonFrontRight(null);
  //   setSelectedButtonRear1Left(buttonIndex);
  //   setSelectedButtonRear2Left(null);
  // };

  const handleButtonPressSpare = buttonIndex => {
    setSelectedButtonSpare(buttonIndex);
    setSelectedButtonRear1Right(null);
    setSelectedButtonFrontLeft(null);
    setSelectedButtonFrontRight(null);
    setSelectedButtonRear1Left(null);
    setSelectedButtonRear2Left(null);
  };
  // const handleButtonPressRear2Left = (buttonIndex) => {
  //   setSelectedButtonSpare(null);
  //   setSelectedButtonRear1Right(null);
  //   setSelectedButtonFrontLeft(null);
  //   setSelectedButtonFrontRight(null);
  //   setSelectedButtonRear1Left(null);
  //   setSelectedButtonRear2Left(buttonIndex);
  // };

  const scanned = () => {
    // console.log("this is", selectedButtonFrontRight);
    // console.log("called me from parent");
    // if (selectedButtonFrontRight !== null) {
    //   console.log("it is correct");
    // }
    if (selectedButtonFrontRight !== null) {
      console.log('before', indexRecordFrontRight);
      console.log('index', selectedButtonFrontRight);
      // let copyIndex = [...indexRecordFrontRight];
      // setIndexRecordFrontRight([...copyIndex, selectedButtonFrontRight]);
      setIndexRecordFrontRight(previous => [
        ...previous,
        selectedButtonFrontRight,
      ]);
      console.log('after', indexRecordFrontRight);
    } else if (selectedButtonRear1Right !== null) {
      let copyIndex = [...indexRecordRear1Right];
      setIndexRecordRear1Right([...copyIndex, selectedButtonRear1Right]);
    } else if (selectedButtonSpare !== null) {
      let copyIndex = [...indexRecordRear2Right];
      setIndexRecordRear2Right([...copyIndex, selectedButtonSpare]);
    } else if (selectedButtonFrontLeft !== null) {
      let copyIndex = [...indexRecordFrontLeft];
      setIndexRecordFrontLeft([...copyIndex, selectedButtonFrontLeft]);
      console.log('after', indexRecordFrontLeft);
    } else if (selectedButtonRear1Left !== null) {
      let copyIndex = [...indexRecordRear1Left];
      setIndexRecordRear1Left([...copyIndex, selectedButtonRear1Left]);
    } else if (selectedButtonRear2Left !== null) {
      let copyIndex = [...indexRecordRear2Left];
      setIndexRecordRear2Left([...copyIndex, selectedButtonRear2Left]);
    }
  };

  //For parallel comm

  useEffect(() => {
    console.log(
      'chassis connection',
      `${creden.WS_URI}/ws/${props.vin}/${creden.ticket}`,
    );
    const newWs = new WebSocket(
      `${creden.WS_URI}/ws/${props.vin}/${creden.ticket}`,
    );
    setWs(newWs);

    newWs.onopen = () => {
      console.log('Opened, connected to the server from chasis');
    };

    newWs.onclose = e => {
      console.log('Disconnected from chasis. Check internet or server.');
    };

    newWs.onerror = e => {
      console.log(e.message);
    };

    newWs.onmessage = e => {
      console.log('Message received from chassis:', e.data);

      // Ensure that e.data is parsed as JSON if it's a JSON string
      let parsedData;
      try {
        parsedData = JSON.parse(e.data);
        console.log('parsed', parsedData);
      } catch (error) {
        console.error('Failed to parse e.data as JSON:', error);
        return;
      }

      // Check if the parsed data contains an alert field
      if (parsedData.alert === 'DB_UPDATED') {
        props.fetchChassisData(); // Corrected function call
        console.log('DB_UPDATED in Smodel');
      } else {
        try {
          // Assuming outerMessage is already parsed into parsedData
          const outerMessage = parsedData;

          // Check if outerMessage.message is a valid JSON string
          const innerMessage = JSON.parse(outerMessage.message);
          const {id, selected} = innerMessage;

          // Update the selections
          setSelections(prevSelections => ({
            ...prevSelections,
            [id]: selected,
          }));

          // Update other selections with specific logic
          setOtherSelections(prevSelections => {
            const updatedSelections = {...prevSelections, [id]: selected};

            // Set the key for the selected wheel to false if it exists
            if (selectedWheelDataKey != null) {
              updatedSelections[selectedWheelDataKey] = false;
            }

            return updatedSelections;
          });
        } catch (error) {
          console.error('Failed to parse outerMessage.message:', error);
        }
      }
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      newWs.close();
    };
  }, []);

  const sendMessage = (id, selected) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('Sending message:', {id, selected});
      ws.send(JSON.stringify({id, selected}));
    }
  };

  // const handleSelection = (id, newSelectedWheelData) => {
  //   //Check if the item is already selected
  //   if (selections[id] === undefined || selections[id] === false) {
  //     if (selectedId !== id) {
  //       console.log(`Selecting item ${id}`);
  //       setSelectedId(id);
  //       sendMessage(id, true);

  //       if (selectedId !== null) {
  //         sendMessage(selectedId, false);
  //       }
  //       // Dispatch the action to set selectedWheelData in the Redux store
  //       dispatch(setSelectedWheelDataGlobal(newSelectedWheelData));
  //     }
  //   } else {
  //     console.log(`Item ${id} is already selected by another device.`);
  //   }
  // };
  const handleSelection = (id, newSelectedWheelData) => {
    //Check if the item is already selected

    if (selectedId !== id) {
      if (selections[id] === undefined || selections[id] === false) {
        console.log(`Selecting item ${id}`);
        setSelectedId(id);
        sendMessage(id, true);

        if (selectedId !== null) {
          sendMessage(selectedId, false);
        }
        // Dispatch the action to set selectedWheelData in the Redux store
        dispatch(setSelectedWheelDataGlobal(newSelectedWheelData));
        console.log('selectedWheelDataGlobal:', selectedWheelDataGlobal);
      } else {
        console.log(`Item ${id} is already selected by another device.`);
        //make selection null
        // dispatch(
        //   setSelectedWheelDataGlobal({
        //     axle_location: null,
        //     wheel_pos: null,
        //     wheel_id: null,
        //     wheel_tin: null,
        //   }),
        // );
      }
    }
  };

  const time = () => {
    // Set the state to true after mounting and if it comes from camera screen
    if (props.fromCameraScreen) {
      setShowMessage(true);
    }
    // Set the state back to false after 8 seconds
    const timeout = setTimeout(() => {
      setShowMessage(false);
    }, 8000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  };

  // props.chasisRef.current = {
  //   scanned: scanned,
  //   time: time,
  //   selectedButtonFrontRight: selectedButtonFrontRight,
  //   selectedButtonRear1Right: selectedButtonRear1Right,
  //   selectedButtonRearSpare: selectedButtonSpare,
  //   selectedButtonFrontLeft: selectedButtonFrontLeft,
  //   selectedButtonRear1Left: selectedButtonRear1Left,
  //   selectedButtonRear2Left: selectedButtonRear2Left,
  // };

  //New chasisRef
  props.chasisRef.current = {
    scanned: scanned,
    time: time,
    selectedButtonFFRight: selectedButtonFFRight,
    selectedButtonFRRight: selectedButtonFRRight,
    selectedButtonPARight: selectedButtonPARight,
    selectedButtonRFRight: selectedButtonRFRight,
    selectedButtonRRRight: selectedButtonRRRight,
    selectedButtonTARight: selectedButtonTARight,
    selectedButtonFFLeft: selectedButtonFFLeft,
    selectedButtonFRLeft: selectedButtonFRLeft,
    selectedButtonPALeft: selectedButtonPALeft,
    selectedButtonRFLeft: selectedButtonRFLeft,
    selectedButtonRRLeft: selectedButtonRRLeft,
    selectedButtonTALeft: selectedButtonTALeft,
  };

  // Function to filter out wheels based on wheel position
  const filterWheels = (car, wheelPositionToKeep) => {
    // Create a new array for the filtered axles
    const filteredAxles = [];

    // Iterate through the axles_data array
    car.axles_data.forEach(axle => {
      // Filter in wheels with the specified wheel position
      const wheelsWithPosition = axle.wheels_data.filter(
        wheel => wheel.wheel_pos === wheelPositionToKeep,
      );

      // Check if there are filtered wheels, and if so, add them to the filtered axles
      if (wheelsWithPosition.length > 0) {
        const filteredAxle = {...axle, wheels_data: wheelsWithPosition};
        filteredAxles.push(filteredAxle);
      }
    });

    // Create a new car object with the filtered axles
    const filteredCar = {...car, axles_data: filteredAxles};

    return filteredCar;
  };

  // Create objects for "L" and "R" positions with retained data
  const carWithWheelsL = filterWheels(props.model, 'L');
  const carWithWheelsR = filterWheels(props.model, 'R');
  const carWithWheelsS = filterWheels(props.model, 'S');

  // console.log("left position:", carWithWheelsL.axles_data);
  // console.log("right position:", carWithWheelsR);
  // console.log("spare position:", carWithWheelsS.axles_data);

  const handleButtonPressSpareGlobal = (buttonIndex, tin) => {
    let axleId;
    const selectedWheel = carWithWheelsS.axles_data
      .map(frontAxle => {
        // axleId = frontAxle.axle_id;
        return frontAxle.wheels_data;
      })
      .flat()[buttonIndex];

    const newSelectedWheelData = {
      axle_location: 'Spare',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
      wheel_tin: tin,
    };
    const newSelectedWheelDataKey = {
      axle_location: 'Spare',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
    };
    console.log('Selected Wheel Data for spare:', newSelectedWheelData);
    const key = JSON.stringify(newSelectedWheelDataKey); // Constructing unique key
    setSelectedWheelDataKey(key);
    handleSelection(key, newSelectedWheelData);
    // setSelectedWheelData(newSelectedWheelData);
    // Dispatch the action to set selectedWheelData in the Redux store
    // dispatch(setSelectedWheelDataGlobal(newSelectedWheelData));
  };

  const handleSetSelectedWheelDataKey = key => {
    setSelectedWheelDataKey(key);
  };

  return (
    <View style={styles.container}>
      {/* <STyre
        model={carWithWheelsR}
        selectedButtonFront={selectedButtonFrontRight}
        selectedButtonRear1={selectedButtonRear1Right}
        selectedButtonRear2={selectedButtonSpare}
        indexRecordFront={indexRecordFrontRight}
        indexRecordRear1={indexRecordRear1Right}
        indexRecordRear2={indexRecordRear2Right}
        onSelectButtonFront={handleButtonPressFrontRight}
        onSelectButtonRear1={handleButtonPressRear1Right}
        onSelectButtonRear2={handleButtonPressSpare}
        showMessage={showMessage}
        elapsedTime={props.elapsedTime}
        side={"right"}
        fromCameraScreen={props.fromCameraScreen}
        enableRescan={props.enableRescan}
      /> */}
      <SAxle
        model={carWithWheelsR}
        selectedButtonFF={selectedButtonFFRight}
        selectedButtonFR={selectedButtonFRRight}
        selectedButtonPA={selectedButtonPARight}
        selectedButtonRF={selectedButtonRFRight}
        selectedButtonRR={selectedButtonRRRight}
        selectedButtonTA={selectedButtonTARight}
        onSelectButtonFF={handleButtonPressFFRight}
        onSelectButtonFR={handleButtonPressFRRight}
        onSelectButtonPA={handleButtonPressPARight}
        onSelectButtonRF={handleButtonPressRFRight}
        onSelectButtonRR={handleButtonPressRRRight}
        onSelectButtonTA={handleButtonPressTARight}
        enableRescan={props.enableRescan}
        // selectedId={selectedId}
        selections={selections}
        otherSelections={otherSelections}
        handleSelection={handleSelection}
        setSelectedWheelDataKey={handleSetSelectedWheelDataKey}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: s(324),
          height: vs(128),
          // backgroundColor: 'red',
        }}>
        <Text
          style={{
            color: 'black',
            transform: [{rotate: '-90deg'}],
            left: s(100),
            fontWeight: 'bold',
          }}>
          FRONT
        </Text>
        <Image
          source={chassis2}
          style={{
            resizeMode: 'contain',
            transform: [{rotate: '-90deg'}],
            bottom: vs(8),
            // width: 300,
            left: s(26),
            height: vs(145),
          }}
        />
        <Text
          style={{
            color: 'black',
            transform: [{rotate: '-90deg'}],
            left: s(70),
            fontWeight: 'bold',
          }}>
          REAR
        </Text>
        {carWithWheelsS.axles_data.map(spareAxle => (
          <View
            key={spareAxle.axle_location}
            style={{
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              height: vs(128),
              width: s(50),
            }}>
            {spareAxle.wheels_data.map((wheel, index) => {
              const id = JSON.stringify({
                axle_location: 'Spare',
                wheel_pos: wheel.wheel_pos,
                wheel_id: wheel.wheel_id,
                // wheel_tin: wheel.wheel_tin ? wheel.wheel_tin : null,
              }); // Constructing unique key
              const isSelected = selections[id] || false;
              const otherSelected = otherSelections[id] || false;
              return (
                <View>
                  {creden.zone === 'Front' ? (
                    <TouchableOpacity
                      // key={wheel.wheel_id}
                      key={wheel.tin}
                      style={[
                        styles.spare,
                        {
                          backgroundColor:
                            wheel.tin != '' && wheel.tin != null
                              ? '#4CAF50'
                              : isSelected
                              ? '#ffbf00'
                              : '#ff2800',
                        },
                        {
                          height:
                            selectedButtonSpare === index &&
                            selectedWheelDataGlobal.axle_location ===
                              spareAxle.axle_location
                              ? vs(35)
                              : vs(32),
                        },
                        {
                          width:
                            selectedButtonSpare === index &&
                            selectedWheelDataGlobal.axle_location ===
                              spareAxle.axle_location
                              ? s(55)
                              : s(52),
                        },
                      ]}
                      onPress={() => {
                        dispatch(setTinGlobal(wheel.tin));
                        // dispatch(
                        //   setSelectedWheelDataGlobal({
                        //     axle_location: null,
                        //     wheel_pos: null,
                        //     wheel_id: null,
                        //     wheel_tin: null,
                        //   }),
                        // );
                        // if (selectedId !== null) {
                        //   sendMessage(selectedId, false);
                        // }
                      }}>
                      <View
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
                          borderRadius: 2, // Same as the button's border radius
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          width: '100%',
                        }}>
                        <Text style={styles.text}>S{wheel.wheel_id}</Text>
                      </View>
                    </TouchableOpacity>
                  ) : otherSelected ? (
                    <TouchableOpacity
                      // key={wheel.wheel_id}
                      key={wheel.tin}
                      style={[
                        styles.spare,
                        {
                          backgroundColor:
                            wheel.tin != '' && wheel.tin != null
                              ? '#4CAF50'
                              : isSelected
                              ? '#ffbf00'
                              : '#ff2800',
                        },
                        {
                          height:
                            selectedButtonSpare === index &&
                            selectedWheelDataGlobal.axle_location ===
                              spareAxle.axle_location
                              ? vs(35)
                              : vs(32),
                        },
                        {
                          width:
                            selectedButtonSpare === index &&
                            selectedWheelDataGlobal.axle_location ===
                              spareAxle.axle_location
                              ? s(55)
                              : s(52),
                        },
                      ]}
                      onPress={() => {
                        dispatch(setTinGlobal(wheel.tin));
                        // dispatch(
                        //   setSelectedWheelDataGlobal({
                        //     axle_location: null,
                        //     wheel_pos: null,
                        //     wheel_id: null,
                        //     wheel_tin: null,
                        //   }),
                        // );
                        // if (selectedId !== null) {
                        //   sendMessage(selectedId, false);
                        // }
                      }}>
                      <Text style={styles.text}>S{wheel.wheel_id}</Text>
                    </TouchableOpacity>
                  ) : !props.enableRescan &&
                    wheel.tin != '' &&
                    wheel.tin != null ? (
                    <TouchableOpacity
                      // key={wheel.wheel_id}
                      key={wheel.tin}
                      style={[
                        styles.spare,
                        {
                          backgroundColor:
                            wheel.tin != '' && wheel.tin != null
                              ? '#4CAF50'
                              : isSelected
                              ? '#ffbf00'
                              : '#ff2800',
                        },
                        {
                          height:
                            wheel.tin != '' && wheel.tin != null
                              ? vs(32)
                              : selectedButtonSpare === index &&
                                selectedWheelDataGlobal.axle_location ===
                                  spareAxle.axle_location
                              ? vs(35)
                              : vs(32),
                        },
                        {
                          width:
                            wheel.tin != '' && wheel.tin != null
                              ? s(52)
                              : selectedButtonSpare === index &&
                                selectedWheelDataGlobal.axle_location ===
                                  spareAxle.axle_location
                              ? s(55)
                              : s(52),
                        },
                      ]}
                      onPress={() => {
                        dispatch(setTinGlobal(wheel.tin));
                        // dispatch(
                        //   setSelectedWheelDataGlobal({
                        //     axle_location: null,
                        //     wheel_pos: null,
                        //     wheel_id: null,
                        //     wheel_tin: null,
                        //   }),
                        // );
                        // if (selectedId !== null) {
                        //   sendMessage(selectedId, false);
                        // }
                      }}>
                      <Text style={styles.text}>S{wheel.wheel_id}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      // key={wheel.wheel_id}
                      key={wheel.tin}
                      style={[
                        styles.spare,
                        {
                          backgroundColor:
                            wheel.tin != '' && wheel.tin != null
                              ? '#4CAF50'
                              : isSelected
                              ? '#ffbf00'
                              : '#ff2800',
                        },
                        {
                          height:
                            selectedButtonSpare === index &&
                            selectedWheelDataGlobal.axle_location ===
                              spareAxle.axle_location
                              ? vs(35)
                              : vs(32),
                        },
                        {
                          width:
                            selectedButtonSpare === index &&
                            selectedWheelDataGlobal.axle_location ===
                              spareAxle.axle_location
                              ? s(55)
                              : s(52),
                        },
                      ]}
                      onPress={() => {
                        handleButtonPressSpare(index);
                        handleButtonPressSpareGlobal(
                          index,
                          // spareAxle.axle_id,
                          wheel.tin,
                        );
                        dispatch(setTinGlobal(wheel.tin));
                      }}>
                      <Text style={styles.text}>S{wheel.wheel_id}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* <View style={styles.rectangle}>
        <Text style={styles.text}>MHCV Model {props.model.id}</Text>
        <View style={styles.spareContainer}>
          <TouchableOpacity
            style={[
              styles.spare,
              // {
              //   backgroundColor:
              //     wheel.tin != "" && wheel.tin != null
              //       ? "green"
              //       : props.selectedButtonRear1 === index &&
              //         selectedWheelData.axle_id === backAxle.axle_id
              //       ? "#ffbf00"
              //       : "#ff2800",
              // },
              // {
              //   height:
              //     props.selectedButtonRear1 === index &&
              //     selectedWheelData.axle_id === backAxle.axle_id
              //       ? 35
              //       : 30,
              // },
              // {
              //   width:
              //     props.selectedButtonRear1 === index &&
              //     selectedWheelData.axle_id === backAxle.axle_id
              //       ? 55
              //       : 50,
              // },
            ]}
            onPress={() => {
              // onSelectButtonRear2(index);
              // handleButtonPressRear1Right(index, backAxle.axle_id);
              // dispatch(setTinGlobal(wheel.tin));
            }}
          >
            <Text style={styles.text}>S1</Text>
          </TouchableOpacity>
           <TouchableOpacity style={styles.spare}>
            <Text style={styles.text}>S1</Text>
          </TouchableOpacity> 
        </View> 

        <Text style={styles.text}>MHCV Model</Text> 
        <Text style={styles.text}>TATA LPT 4830 / SIGNA 4830.T</Text> 
      </View> */}
      {/* <STyre
        model={carWithWheelsL}
        selectedButtonFront={selectedButtonFrontLeft}
        selectedButtonRear1={selectedButtonRear1Left}
        selectedButtonRear2={selectedButtonRear2Left}
        indexRecordFront={indexRecordFrontLeft}
        indexRecordRear1={indexRecordRear1Left}
        indexRecordRear2={indexRecordRear2Left}
        onSelectButtonFront={handleButtonPressFrontLeft}
        onSelectButtonRear1={handleButtonPressRear1Left}
        onSelectButtonRear2={handleButtonPressRear2Left}
        showMessage={showMessage}
        elapsedTime={props.elapsedTime}
        side={"left"}
        fromCameraScreen={props.fromCameraScreen}
        enableRescan={props.enableRescan}
      /> */}
      <SAxle
        model={carWithWheelsL}
        selectedButtonFF={selectedButtonFFLeft}
        selectedButtonFR={selectedButtonFRLeft}
        selectedButtonPA={selectedButtonPALeft}
        selectedButtonRF={selectedButtonRFLeft}
        selectedButtonRR={selectedButtonRRLeft}
        selectedButtonTA={selectedButtonTALeft}
        onSelectButtonFF={handleButtonPressFFLeft}
        onSelectButtonFR={handleButtonPressFRLeft}
        onSelectButtonPA={handleButtonPressPALeft}
        onSelectButtonRF={handleButtonPressRFLeft}
        onSelectButtonRR={handleButtonPressRRLeft}
        onSelectButtonTA={handleButtonPressTALeft}
        enableRescan={props.enableRescan}
        // selectedId={selectedId}
        selections={selections}
        otherSelections={otherSelections}
        handleSelection={handleSelection}
        setSelectedWheelDataKey={handleSetSelectedWheelDataKey}
      />
    </View>
    // </ScrollView>
  );
};

export default Chasis;

const styles = ScaledSheet.create({
  container: {
    // margin: '45@ms',
    // marginTop: '50@vs',
    // marginBottom: '50@vs',
    transform: [{rotate: '90deg'}],
    // backgroundColor: "red",
  },
  rectangle: {
    width: '300@s',
    height: '120@vs',
    backgroundColor: '#007acc',
    // margin: '30@ms',
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: "column",
  },
  spareContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spare: {
    width: '30@s',
    height: '50@vs',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: '22@ms',
    // marginBottom: '-50@vs',
    // margin: '5@ms',
    // transform: [{ rotate: "-90deg" }],
    borderRadius: '2@ms',
  },
  text: {
    transform: [{rotate: '-90deg'}],
    color: 'white',
  },
});
