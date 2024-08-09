import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Profile = ({navigation} : any) => {
  const [name, setName] = useState('');
  useEffect(() => {
    const getNameFromStorage = async () => {
      const localName = (await AsyncStorage.getItem('name')) || 'user';
      setName(capitalizeFirstLetter(localName));
    };
    getNameFromStorage();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('login');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1, justifyContent: 'space-between'}}>
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
                source={require('../../../assets/images/userProfile.png')}
              />
            </View>
          </View>
          <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
            <Text style={{fontFamily: 'Poppins-SemiBold', color: 'black'}}>
              {name}
            </Text>
          </View>
          {/* cards */}
          {/* active bookings */}
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
                    source={require('../../../assets/images/car.png')}
                  />
                  <Text style={{fontFamily: 'Poppins-Medium', color: 'black'}}>
                    Active Bookings
                  </Text>
                </View>
                <Image
                  style={{width: 15, height: 15, borderRadius: 200}}
                  source={require('../../../assets/images/forward-stick.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* past bookings */}
          <View
            style={{
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('request-history')}>
              <View
                style={{
                  padding: 20,
                  marginHorizontal: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#e4e4e4',
                  borderRadius: 20,
                }}>
                <View style={{flexDirection: 'row', gap: 20}}>
                  <Image
                    style={{width: 20, height: 20}}
                    source={require('../../../assets/images/time-past.png')}
                  />
                  <Text style={{fontFamily: 'Poppins-Medium', color: 'black'}}>
                    Past Bookings
                  </Text>
                </View>
                <Image
                  style={{width: 15, height: 15, borderRadius: 200}}
                  source={require('../../../assets/images/forward-stick.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* contact admin */}
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
                    source={require('../../../assets/images/setting.png')}
                  />
                  <Text style={{fontFamily: 'Poppins-Medium', color: 'black'}}>
                    Contact Admin
                  </Text>
                </View>
                <Image
                  style={{width: 15, height: 15, borderRadius: 200}}
                  source={require('../../../assets/images/forward-stick.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* logout button */}
        <View
          style={{
            width: '100%',
            padding: 20,
            backgroundColor: 'white',
          }}>
          <TouchableOpacity onPress={handleLogout}>
            <View
              style={{
                padding: 20,
                borderRadius: 20,
                backgroundColor: '#ff4d4d',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: 'Poppins-Medium', color: 'white'}}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
