import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import useGetTextData from '../../hooks/useGetTestData';

const Landing = ({navigation}: any) => {
  const {data, error, isLoading} = useGetTextData();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
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
    <View style={styles.container}>
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
          style={{width: 50, height: 50}}
          onPress={() => navigation.navigate('login')}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 200,
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
    </View>
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
