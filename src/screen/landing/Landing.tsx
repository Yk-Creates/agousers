import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useGetTextData from '../../hooks/useGetTestData';


const Landing = () => {
  const {data, error, isLoading} = useGetTextData();
  const navigation = useNavigation();
  
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
      <Image
        source={require('../../assets/images/ago.png')}
        style={styles.image}
      />
    <TouchableOpacity onPress={() => navigation.navigate('login')}> 
        <Image
          source={require('../../assets/images/rightarrow.png')}
          style={styles.rightArrow}
        />
      </TouchableOpacity>
      <Image
        source={require('../../assets/images/bottom_design.png')}
        style={styles.bottomImage}
      />
    </View>
  );
};

export default Landing;
const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    height: 500,
    resizeMode: 'cover',
  },
});