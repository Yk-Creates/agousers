import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React from 'react';
import useGetTextData from '../../hooks/useGetTestData';


const Landing = () => {
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
      <Text style={styles.dataText}>{data?.message}</Text>
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataText: {
    color: '#ffffff',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
