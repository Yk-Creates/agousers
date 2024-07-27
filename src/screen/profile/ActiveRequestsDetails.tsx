import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const ActiveRequestsDetails = ({route, navigation}: any) => {
  const {item} = route.params;
  console.log(item);
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Image
            style={styles.backIcon}
            source={require('../../assets/images/arrow.png')}
          />
          <Text style={styles.headerText}>back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Driver Details</Text>
      </View>
      <View style={{padding: 10, borderWidth: 1, margin: 10, borderRadius: 10}}>
        {/* driver Name */}
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
          }}>
          <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
            Name
          </Text>
          <Text style={{color: 'black', fontFamily: 'Poppins-SemiBold'}}>
            {item.driver.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            Car Model
          </Text>
          <Text style={{color: 'black', fontFamily: 'Poppins-SemiBold'}}>
            {item.driver.carModel}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            Car Number
          </Text>
          <Text style={{color: 'black', fontFamily: 'Poppins-SemiBold'}}>
            {item.driver.carNumber}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            Driver No
          </Text>
          <Text style={{color: 'black', fontFamily: 'Poppins-SemiBold'}}>
            {item.driver.phone}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            Car Type
          </Text>
          <Text style={{color: 'black', fontFamily: 'Poppins-SemiBold'}}>
            {item.driver.carType}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ActiveRequestsDetails;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#1B2024',
  },
  backIcon: {
    width: 15,
    height: 15,
  },
  headerText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
    marginTop: 2,
  },
});
