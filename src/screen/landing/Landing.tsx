import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import useGetTextData from '../../hooks/useGetTestData';

const Landing = ({navigation}: any) => {
  const {data, error, isLoading} = useGetTextData();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text
          style={{color: 'white', fontFamily: 'Poppins-Medium', marginTop: 10}}>
          Loading
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading data</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* logo */}
      <View style={{alignItems: 'center', marginTop: 100}}>
        <View>
          <Image
            style={{width: 250, height: 250}}
            source={require('../../assets/images/ago.png')}
          />
        </View>
        {/* button */}

        <TouchableOpacity
          style={{width: 80, height: 30}}
          onPress={() => navigation.navigate('login')}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 200,
              alignItems: 'center',
            }}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../../assets/images/right-arrow.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
      {/* footer */}
      <View>
        <Image
          style={styles.bottomImage}
          source={require('../../assets/images/bottomCity.png')}
        />
      </View>
    </SafeAreaView>
  );
};

export default Landing;
const {width: screenWidth} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    backgroundColor: '#0C0C0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataText: {
    color: '#000',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 50,
  },
  rightArrow: {
    cursor: 'pointer',
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  bottomImage: {
    width: screenWidth,
    height: 250,
    resizeMode: 'cover',
  },
});
