import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Profile = ({navigation}) => {
  const [name, setName] = useState('');
  useEffect(() => {
    const getNameFromStorage = async () => {
      const localName = (await AsyncStorage.getItem('name')) || 'user';
      setName(capitalizeFirstLetter(localName));
    };
    getNameFromStorage();
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View>
        <View
          style={{
            backgroundColor: '#1B2024',
            width: '100%',
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-Regular',
              fontSize: 20,
            }}>
            Profile
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 30,
            alignItems: 'center',
          }}>
          <View
            style={{borderWidth: 1, borderRadius: 200, borderColor: 'gray'}}>
            <Image
              resizeMode="contain"
              style={{width: 100, height: 100, borderRadius: 200}}
              source={require('../../assets/images/userProfile.png')}
            />
          </View>
        </View>
        <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
          <Text style={{fontFamily: 'Poppins-SemiBold', color: 'black'}}>
            {name}
          </Text>
        </View>
        {/* cards */}
        <View
          style={{
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('active-requests')}>
            <View
              style={{
                padding: 20,
                margin: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#e4e4e4',
                borderRadius: 20,
              }}>
              <View style={{flexDirection: 'row', gap: 20}}>
                <Image
                  style={{width: 20, height: 20}}
                  source={require('../../assets/images/car.png')}
                />
                <Text style={{fontFamily: 'Poppins-Medium', color: 'black'}}>
                  Active Bookings
                </Text>
              </View>
              <Image
                style={{width: 15, height: 15, borderRadius: 200}}
                source={require('../../assets/images/forward-stick.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
