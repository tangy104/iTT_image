import {StyleSheet, Text, View} from 'react-native';
import {s, vs, ms, ScaledSheet} from 'react-native-size-matters';
import React from 'react';

const AboutApp = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: s(10),
      }}>
      <Text style={{color: 'black', textAlign: 'justify'}}>
        The iTT (intelligent Tyre Tracer) app is a specialized tool developed by
        Centre of Excellence in Advanced Manufacturing Technology, IIT Kharagpur
        for TATA Motors to streamline the tyre-fitting process in vehicle
        manufacturing. The app ensures accurate and efficient tyre tracking by
        scanning unique TIN (Tyre Identification Number) of tyres to be fitted
        on a vehicle. The app allows to perform VIN (Vehicle Identification
        Number) and VC (Vehicle Chassis) barcode scanning providing seamless
        integration with the backend server for data storage and management,
        ensuring proper association of tyres with the respective vehicles. The
        iTT app enhances operational accuracy, reduces manual effort, and
        ensures each tyre is correctly fitted by automating the tracking and
        validation processes.
      </Text>
    </View>
  );
};

export default AboutApp;

const styles = StyleSheet.create({});
