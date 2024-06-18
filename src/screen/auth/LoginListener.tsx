import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const LoginListener = ({navigation}: any) => {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.replace('home');
        } else {
          navigation.replace('landing');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        navigation.navigate('Landing');
      }
    };

    checkToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
      <Text
        style={{color: 'white', fontFamily: 'Poppins-Medium', marginTop: 10}}>
        Loading
      </Text>
    </View>
  );
};

export default LoginListener;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0C0C',
  },
});
