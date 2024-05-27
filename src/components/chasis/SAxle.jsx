import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedWheelDataGlobal} from '../../state/selectSlice';
import {setTinGlobal} from '../../state/tinslice';

const SAxle = props => {
  const dispatch = useDispatch();
  const [selectedWheelData, setSelectedWheelData] = useState(null);
  const selectedWheelDataGlobal = useSelector(
    state => state.app.selectedWheelDataGlobal,
  );

  const handleButtonPressFF = (buttonIndex, tin) => {
    // let axleId;
    const selectedWheel = carWithAxleFF
      .map(axle => {
        // axleId = axle.axle_id;
        return axle.wheels_data;
      })
      .flat()[buttonIndex];

    const newSelectedWheelData = {
      axle_location: 'FF',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
      wheel_tin: tin,
    };
    const newSelectedWheelDataKey = {
      axle_location: 'FF',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
    };
    setSelectedWheelData(newSelectedWheelData);
    const key = JSON.stringify(newSelectedWheelDataKey); // Constructing unique key
    props.handleSelection(key);
    // console.log("newSelectedWheelData:", newSelectedWheelData);
    // Dispatch the action to set selectedWheelData in the Redux store
    dispatch(setSelectedWheelDataGlobal(newSelectedWheelData));
    console.log('selectedWheelDataGlobal:', selectedWheelDataGlobal);
  };

  const handleButtonPressFR = (buttonIndex, tin) => {
    // let axleId;
    const selectedWheel = carWithAxleFR
      .map(axle => {
        // axleId = axle.axle_id;
        return axle.wheels_data;
      })
      .flat()[buttonIndex];

    const newSelectedWheelData = {
      axle_location: 'FR',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
      wheel_tin: tin,
    };
    const newSelectedWheelDataKey = {
      axle_location: 'FR',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
    };
    setSelectedWheelData(newSelectedWheelData);
    const key = JSON.stringify(newSelectedWheelDataKey); // Constructing unique key
    props.handleSelection(key);
    // Dispatch the action to set selectedWheelData in the Redux store
    dispatch(setSelectedWheelDataGlobal(newSelectedWheelData));
  };

  const handleButtonPressPA = (buttonIndex, tin) => {
    // let axleId;
    const selectedWheel = carWithAxlePA
      .map(axle => {
        // axleId = axle.axle_id;
        return axle.wheels_data;
      })
      .flat()[buttonIndex];

    const newSelectedWheelData = {
      axle_location: 'Pusher_Axle',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
      wheel_tin: tin,
    };
    const newSelectedWheelDataKey = {
      axle_location: 'Pusher_Axle',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
    };
    setSelectedWheelData(newSelectedWheelData);
    const key = JSON.stringify(newSelectedWheelDataKey); // Constructing unique key
    props.handleSelection(key);
    // Dispatch the action to set selectedWheelData in the Redux store
    dispatch(setSelectedWheelDataGlobal(newSelectedWheelData));
  };

  const handleButtonPressRF = (buttonIndex, tin) => {
    // let axleId;
    const selectedWheel = carWithAxleRF
      .map(axle => {
        // axleId = axle.axle_id;
        return axle.wheels_data;
      })
      .flat()[buttonIndex];

    const newSelectedWheelData = {
      axle_location: 'RF',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
      wheel_tin: tin,
    };
    const newSelectedWheelDataKey = {
      axle_location: 'RF',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
    };
    setSelectedWheelData(newSelectedWheelData);
    const key = JSON.stringify(newSelectedWheelDataKey); // Constructing unique key
    props.handleSelection(key);
    // Dispatch the action to set selectedWheelData in the Redux store
    dispatch(setSelectedWheelDataGlobal(newSelectedWheelData));
  };

  const handleButtonPressRR = (buttonIndex, tin) => {
    // let axleId;
    const selectedWheel = carWithAxleRR
      .map(axle => {
        // axleId = axle.axle_id;
        return axle.wheels_data;
      })
      .flat()[buttonIndex];

    const newSelectedWheelData = {
      axle_location: 'RR',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
      wheel_tin: tin,
    };
    const newSelectedWheelDataKey = {
      axle_location: 'RR',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
    };
    setSelectedWheelData(newSelectedWheelData);
    const key = JSON.stringify(newSelectedWheelDataKey); // Constructing unique key
    props.handleSelection(key);
    // Dispatch the action to set selectedWheelData in the Redux store
    dispatch(setSelectedWheelDataGlobal(newSelectedWheelData));
  };

  const handleButtonPressTA = (buttonIndex, tin) => {
    // let axleId;
    const selectedWheel = carWithAxleTA
      .map(axle => {
        // axleId = axle.axle_id;
        return axle.wheels_data;
      })
      .flat()[buttonIndex];

    const newSelectedWheelData = {
      axle_location: 'Tag_Lift_Axle',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
      wheel_tin: tin,
    };
    const newSelectedWheelDataKey = {
      axle_location: 'Tag_Lift_Axle',
      // axle_id: axle_id,
      wheel_pos: selectedWheel.wheel_pos,
      wheel_id: selectedWheel.wheel_id,
    };
    setSelectedWheelData(newSelectedWheelData);
    const key = JSON.stringify(newSelectedWheelDataKey); // Constructing unique key
    props.handleSelection(key);
    // Dispatch the action to set selectedWheelData in the Redux store
    dispatch(setSelectedWheelDataGlobal(newSelectedWheelData));
  };

  // Function to filter data by axle_location
  const filterDataByAxleLocation = (data, location) => {
    return data.axles_data.filter(axle => axle.axle_location === location);
  };

  const carWithAxleFF = filterDataByAxleLocation(props.model, 'FF');
  const carWithAxleFR = filterDataByAxleLocation(props.model, 'FR');
  const carWithAxlePA = filterDataByAxleLocation(props.model, 'Pusher_Axle');
  const carWithAxleRF = filterDataByAxleLocation(props.model, 'RF');
  const carWithAxleRR = filterDataByAxleLocation(props.model, 'RR');
  const carWithAxleTA = filterDataByAxleLocation(props.model, 'Tag_Lift_Axle');

  // console.log("carWithAxleFF:", carWithAxleFF);
  // console.log("carWithAxleFR:", carWithAxleFR);
  // console.log("carWithAxlePA:", carWithAxlePA);
  // console.log("carWithAxleRF:", carWithAxleRF);
  // console.log("carWithAxleRR:", carWithAxleRR);
  // console.log("carWithAxleTA:", carWithAxleTA);

  return (
    <View
      style={{
        // backgroundColor: "red",
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: "stretch",
      }}>
      <View
        style={{
          flexDirection: 'row',
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          {carWithAxleFF.length > 0
            ? carWithAxleFF.map((axle, index) =>
                axle.wheels_data.map((wheel, wheelIndex) => {
                  const id = JSON.stringify({
                    axle_location: 'FF',
                    wheel_pos: wheel.wheel_pos,
                    wheel_id: wheel.wheel_id,
                    // wheel_tin: wheel.wheel_tin,
                  }); // Constructing unique key
                  const isSelected = props.selections[id] || false;
                  return !props.enableRescan &&
                    wheel.tin != '' &&
                    wheel.tin != null ? (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                              ? 35
                              : props.selectedButtonFF === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            wheel.tin != '' && wheel.tin != null
                              ? 55
                              : props.selectedButtonFF === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        dispatch(setTinGlobal(wheel.tin));
                        dispatch(
                          setSelectedWheelDataGlobal({
                            axle_location: null,
                            wheel_pos: null,
                            wheel_id: null,
                            wheel_tin: null,
                          }),
                        );
                      }}>
                      <Text style={styles.text}>FF</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                            props.selectedButtonFF === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            props.selectedButtonFF === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        props.onSelectButtonFF(wheelIndex);
                        handleButtonPressFF(
                          wheelIndex,
                          // frontAxle.axle_id,
                          wheel.tin,
                        );
                        dispatch(setTinGlobal(wheel.tin));
                      }}>
                      <Text style={styles.text}>FF</Text>
                    </TouchableOpacity>
                  );
                }),
              )
            : null}
        </View>
        <View>
          {carWithAxleFR.length > 0
            ? carWithAxleFR.map((axle, index) =>
                axle.wheels_data.map((wheel, wheelIndex) => {
                  const id = JSON.stringify({
                    axle_location: 'FR',
                    wheel_pos: wheel.wheel_pos,
                    wheel_id: wheel.wheel_id,
                    // wheel_tin: wheel.wheel_tin,
                  }); // Constructing unique key
                  const isSelected = props.selections[id] || false;
                  return !props.enableRescan &&
                    wheel.tin != '' &&
                    wheel.tin != null ? (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                              ? 35
                              : props.selectedButtonFR === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            wheel.tin != '' && wheel.tin != null
                              ? 55
                              : props.selectedButtonFR === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        dispatch(setTinGlobal(wheel.tin));
                        dispatch(
                          setSelectedWheelDataGlobal({
                            axle_location: null,
                            wheel_pos: null,
                            wheel_id: null,
                            wheel_tin: null,
                          }),
                        );
                      }}>
                      <Text style={styles.text}>FR</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                            props.selectedButtonFR === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            props.selectedButtonFR === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        props.onSelectButtonFR(wheelIndex);
                        handleButtonPressFR(
                          wheelIndex,
                          // frontAxle.axle_id,
                          wheel.tin,
                        );
                        dispatch(setTinGlobal(wheel.tin));
                      }}>
                      <Text style={styles.text}>FR</Text>
                    </TouchableOpacity>
                  );
                }),
              )
            : null}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginLeft: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          {carWithAxlePA.length > 0
            ? carWithAxlePA.map((axle, index) =>
                axle.wheels_data.map((wheel, wheelIndex) => {
                  const id = JSON.stringify({
                    axle_location: 'Pusher_Axle',
                    wheel_pos: wheel.wheel_pos,
                    wheel_id: wheel.wheel_id,
                    // wheel_tin: wheel.wheel_tin,
                  }); // Constructing unique key
                  //   console.log('id for comparision:', id);
                  const isSelected = props.selections[id] || false;
                  return !props.enableRescan &&
                    wheel.tin != '' &&
                    wheel.tin != null ? (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                              ? 35
                              : props.selectedButtonPA === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            wheel.tin != '' && wheel.tin != null
                              ? 55
                              : props.selectedButtonPA === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        dispatch(setTinGlobal(wheel.tin));
                        dispatch(
                          setSelectedWheelDataGlobal({
                            axle_location: null,
                            wheel_pos: null,
                            wheel_id: null,
                            wheel_tin: null,
                          }),
                        );
                      }}>
                      <Text style={styles.text}>PA</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                            props.selectedButtonPA === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            props.selectedButtonPA === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        props.onSelectButtonPA(wheelIndex);
                        handleButtonPressPA(
                          wheelIndex,
                          // frontAxle.axle_id,
                          wheel.tin,
                        );
                        dispatch(setTinGlobal(wheel.tin));
                      }}>
                      <Text style={styles.text}>PA</Text>
                    </TouchableOpacity>
                  );
                }),
              )
            : null}
        </View>
        <View>
          {carWithAxleRF.length > 0
            ? carWithAxleRF.map((axle, index) =>
                axle.wheels_data.map((wheel, wheelIndex) => {
                  const id = JSON.stringify({
                    axle_location: 'RF',
                    wheel_pos: wheel.wheel_pos,
                    wheel_id: wheel.wheel_id,
                    // wheel_tin: wheel.wheel_tin,
                  }); // Constructing unique key
                  const isSelected = props.selections[id] || false;
                  return !props.enableRescan &&
                    wheel.tin != '' &&
                    wheel.tin != null ? (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                              ? 35
                              : props.selectedButtonRF === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            wheel.tin != '' && wheel.tin != null
                              ? 55
                              : props.selectedButtonRF === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        dispatch(setTinGlobal(wheel.tin));
                        dispatch(
                          setSelectedWheelDataGlobal({
                            axle_location: null,
                            wheel_pos: null,
                            wheel_id: null,
                            wheel_tin: null,
                          }),
                        );
                      }}>
                      <Text style={styles.text}>RF</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                            props.selectedButtonRF === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            props.selectedButtonRF === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        props.onSelectButtonRF(wheelIndex);
                        handleButtonPressRF(
                          wheelIndex,
                          // frontAxle.axle_id,
                          wheel.tin,
                        );
                        dispatch(setTinGlobal(wheel.tin));
                      }}>
                      <Text style={styles.text}>RF</Text>
                    </TouchableOpacity>
                  );
                }),
              )
            : null}
        </View>
        <View>
          {carWithAxleRR.length > 0
            ? carWithAxleRR.map((axle, index) =>
                axle.wheels_data.map((wheel, wheelIndex) => {
                  const id = JSON.stringify({
                    axle_location: 'RR',
                    wheel_pos: wheel.wheel_pos,
                    wheel_id: wheel.wheel_id,
                    // wheel_tin: wheel.wheel_tin,
                  }); // Constructing unique key
                  const isSelected = props.selections[id] || false;
                  return !props.enableRescan &&
                    wheel.tin != '' &&
                    wheel.tin != null ? (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                              ? 35
                              : props.selectedButtonRR === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            wheel.tin != '' && wheel.tin != null
                              ? 55
                              : props.selectedButtonRR === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        dispatch(setTinGlobal(wheel.tin));
                        dispatch(
                          setSelectedWheelDataGlobal({
                            axle_location: null,
                            wheel_pos: null,
                            wheel_id: null,
                            wheel_tin: null,
                          }),
                        );
                      }}>
                      <Text style={styles.text}>RR</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                            props.selectedButtonRR === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            props.selectedButtonRR === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        props.onSelectButtonRR(wheelIndex);
                        handleButtonPressRR(
                          wheelIndex,
                          // frontAxle.axle_id,
                          wheel.tin,
                        );
                        dispatch(setTinGlobal(wheel.tin));
                      }}>
                      <Text style={styles.text}>RR</Text>
                    </TouchableOpacity>
                  );
                }),
              )
            : null}
        </View>
        <View>
          {carWithAxleTA.length > 0
            ? carWithAxleTA.map((axle, index) =>
                axle.wheels_data.map((wheel, wheelIndex) => {
                  const id = JSON.stringify({
                    axle_location: 'Tag_Lift_Axle',
                    wheel_pos: wheel.wheel_pos,
                    wheel_id: wheel.wheel_id,
                    // wheel_tin: wheel.wheel_tin,
                  }); // Constructing unique key
                  const isSelected = props.selections[id] || false;
                  return !props.enableRescan &&
                    wheel.tin != '' &&
                    wheel.tin != null ? (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                              ? 35
                              : props.selectedButtonTA === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            wheel.tin != '' && wheel.tin != null
                              ? 55
                              : props.selectedButtonTA === wheelIndex &&
                                selectedWheelDataGlobal.axle_location ===
                                  axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        dispatch(setTinGlobal(wheel.tin));
                        dispatch(
                          setSelectedWheelDataGlobal({
                            axle_location: null,
                            wheel_pos: null,
                            wheel_id: null,
                            wheel_tin: null,
                          }),
                        );
                      }}>
                      <Text style={styles.text}>TA</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={`${index}-${wheelIndex}`}
                      style={[
                        styles.tyre,
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
                            props.selectedButtonTA === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 40
                              : 35,
                        },
                        {
                          width:
                            props.selectedButtonTA === wheelIndex &&
                            selectedWheelDataGlobal.axle_location ===
                              axle.axle_location
                              ? 60
                              : 55,
                        },
                      ]}
                      onPress={() => {
                        props.onSelectButtonTA(wheelIndex);
                        handleButtonPressTA(
                          wheelIndex,
                          // frontAxle.axle_id,
                          wheel.tin,
                        );
                        dispatch(setTinGlobal(wheel.tin));
                      }}>
                      <Text style={styles.text}>TA</Text>
                    </TouchableOpacity>
                  );
                }),
              )
            : null}
        </View>
      </View>
    </View>
  );
};

export default SAxle;

const styles = StyleSheet.create({
  tyre: {
    backgroundColor: 'green',
    height: 40,
    width: 55,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  text: {
    color: '#fff',
    transform: [{rotate: '-90deg'}],
  },
});
