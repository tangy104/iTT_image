import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Details = props => {
  return (
    <View style={styles.container}>
      <View style={styles.card1}>
        <Text style={styles.text1}>
          {props.axleLocation === 'Front' ? 'Front' : 'Lift Pusher'} Axle{' '}
          {props.axle} {props.wheelPosition}H
        </Text>
      </View>
      <View style={styles.card2}>
        <Text style={styles.text2}>{props.tin}</Text>
      </View>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // flex:1
  },
  card1: {
    width: 150,
    height: 28,
    backgroundColor: '#007acc',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card2: {
    width: 150,
    height: 28,
    backgroundColor: 'white',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    color: 'white',
  },
  text2: {
    color: 'black',
  },
});
