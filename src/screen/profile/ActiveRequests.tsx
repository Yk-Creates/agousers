import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import useActiveRequests from '../../hooks/useActiveRequests';
import {getAddressFromCoordinates} from '../../utils/geocoding';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ActiveRequests = ({navigation}) => {
  const {data, isLoading, error, refetch} = useActiveRequests();
  const [addresses, setAddresses] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (data) {
      const fetchAddresses = async () => {
        const newAddresses = {};
        for (const item of data) {
          const startAddress = await getAddressFromCoordinates(
            item.start.latitude,
            item.start.longitude,
          );
          const endAddress = await getAddressFromCoordinates(
            item.end.latitude,
            item.end.longitude,
          );
          newAddresses[item._id] = {startAddress, endAddress};
        }
        setAddresses(newAddresses);
      };

      fetchAddresses();
    }
  }, [data]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="black" />
        <Text
          style={{
            color: 'black',
            fontFamily: 'Poppins-Medium',
            marginTop: 10,
          }}>
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

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Ride Request</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={{padding: 16}}>
          <Text style={styles.cardText}>
            <Text style={styles.label}>From: </Text>
            {addresses[item._id]?.startAddress || 'Loading...'}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.label}>To: </Text>
            {addresses[item._id]?.endAddress || 'Loading...'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            paddingHorizontal: 20,
            paddingTop: 10,
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: '#333333',
              }}>
              On : {item.date}
            </Text>

            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: '#333333',
              }}>
              At : {item.time}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',

              color: 'red',
            }}>
            <Text style={styles.label}>Status: </Text>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', gap: 5}}
          onPress={() => navigation.goBack()}>
          <Image
            style={styles.backIcon}
            source={require('../../assets/images/back-stick.png')}
          />
          <Text style={styles.headerText}>back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Active Bookings</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={data ? [...data].reverse() : []}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#ffffff',
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
  },
  cardHeader: {
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#1B2024',
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
  cardBody: {},
  cardText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#333333',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    color: '#1B2024',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#FF0000',
  },
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
  },
});

export default ActiveRequests;
