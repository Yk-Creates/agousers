import React, {useRef, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet from 'react-native-simple-bottom-sheet';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {ScrollView} from 'react-native-gesture-handler';
import useGetCabRates from '../../../hooks/useGetCabRates';
import useBookCab from '../../../hooks/useBookCab';
import smallCabImage from '../../../assets/images/smallCab.png';
import mediumCabImage from '../../../assets/images/mediumCab.png';
import largeCabImage from '../../../assets/images/largeCab.png';

import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';

const CabPayment = ({route, navigation}) => {
  const {data, error, isLoading} = useGetCabRates();
  const {startLat, startLong, startAdd, endLat, endLong, endAdd, date, time} =
    route.params;

  const dateString = typeof date === 'string' ? date : String(date);
  const timeString = typeof time === 'string' ? time : String(time);
  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toLocaleDateString('en-GB');
  const mapRef = useRef(); // Ref for MapView
  const [travelTime, setTravelTime] = useState(null);
  const [distance, setDistance] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const fitToCoordinates = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          {latitude: startLat, longitude: startLong},
          {latitude: endLat, longitude: endLong},
        ],
        {
          edgePadding: {
            top: 50,
            right: 0,
            bottom: Dimensions.get('window').height * 0.7,
            left: 0,
          },
          animated: true,
        },
      );
    }
  };

  // Function to fetch travel distance via roads using Google Directions API
  const fetchTravelDistance = () => {
    const origin = `${startLat},${startLong}`;
    const destination = `${endLat},${endLong}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=AIzaSyC8zy45f-dWZWg0P4A9mGAZjNlMYTnJRvI`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.routes.length > 0) {
          const route = data.routes[0];
          if (route && route.legs.length > 0) {
            const leg = route.legs[0];
            setTravelTime(leg.duration.text);
            setDistance(leg.distance.value / 1000); // Convert meters to kilometers
          }
        }
      })
      .catch(error => {
        console.error('Error fetching directions:', error);
      });
  };

  useEffect(() => {
    fitToCoordinates();
    fetchTravelDistance();
  }, [startLat, startLong, endLat, endLong]);

  const renderCabCards = () => {
    // Check if loading or data is not available
    if (isLoading || !data) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
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

    // Data is available, map over it to render cards
    return data.map(item => {
      const {_id, carType, perKilometerRate} = item;
      const fare = distance * perKilometerRate;

      // Determine which image to use based on carType
      let cabImage;
      switch (carType.toLowerCase()) {
        case 'small':
          cabImage = smallCabImage;
          break;
        case 'medium':
          cabImage = mediumCabImage;
          break;
        case 'large':
          cabImage = largeCabImage;
          break;
        default:
          cabImage = smallCabImage; // Default to small cab image
          break;
      }

      return (
        <View key={_id} style={styles.card}>
          <View style={{}}>
            <Text style={styles.cardTitle}>{carType.toUpperCase()}</Text>
            <Text style={styles.cardText}>₹ {fare.toFixed(2)} (one way)</Text>
            <View style={styles.cardFooter}>
              <Image
                style={styles.icon}
                source={require('../../../assets/images/timer.png')}
              />
              <Text style={styles.cardText}>{travelTime}</Text>
            </View>
          </View>
          <View>
            <Image
              resizeMode="contain"
              style={{width: 100, height: 100, transform: [{rotate: '0deg'}]}}
              source={cabImage} // Use dynamically determined image source
            />
          </View>
        </View>
      );
    });
  };

  const {mutate: bookCab, isPending, isSuccess} = useBookCab();

  const handleConfirm = () => {
    const cabDetails = {
      startLat,
      startLong,
      endLat,
      endLong,
      date: formattedDate,
      time: timeString,
    };
    bookCab(cabDetails); // Call your API to book the cab

    navigation.navigate('Profile');
    Snackbar.show({
      text: 'Cab booked successfully',
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: 'green',
    });
  };

  const openModalOnConfirm = () => {
    toggleModal();
  };

  const handleCancel = () => {
    toggleModal(); // Just close the modal
  };

  return (
    <View style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => navigation.goBack()}>
          <Image
            style={styles.backIcon}
            source={require('../../../assets/images/back-stick.png')}
          />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={{flex: 1}}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          userInterfaceStyle={'dark'}
          showsTraffic
          rotateEnabled
          style={styles.map}
          onMapReady={fitToCoordinates}
          initialRegion={{
            latitude: (startLat + endLat) / 2,
            longitude: (startLong + endLong) / 2,
            latitudeDelta: Math.abs(startLat - endLat) + 1,
            longitudeDelta: Math.abs(startLong - endLong) + 1,
          }}>
          {/* Start Marker */}
          <Marker
            coordinate={{latitude: startLat, longitude: startLong}}
            title={'Start'}
            description={startAdd}>
            <Image
              source={require('../../../assets/images/pin.png')}
              style={styles.markerImage}
            />
          </Marker>

          {/* End Marker */}
          <Marker
            coordinate={{latitude: endLat, longitude: endLong}}
            title={'End'}
            description={endAdd}>
            <Image
              source={require('../../../assets/images/pin.png')}
              style={styles.markerImage}
            />
          </Marker>

          {/* Polyline between start and end */}
          <Polyline
            coordinates={[
              {latitude: startLat, longitude: startLong},
              {latitude: endLat, longitude: endLong},
            ]}
            strokeColor="#000"
            strokeWidth={3}
          />
        </MapView>

        {/* Bottom Sheet */}
        <BottomSheet
          isOpen
          sliderMaxHeight={Dimensions.get('window').height * 0.7}>
          <View style={styles.bottomSheetContent}>
            <ScrollView>{renderCabCards()}</ScrollView>
          </View>
          <View style={{alignItems: 'center', height: 50}}>
            <TouchableOpacity
              style={{
                width: '80%',
                alignItems: 'center',
                backgroundColor: '#1B2024',
                paddingVertical: 8,
                borderRadius: 4,
                justifyContent: 'center',
              }}
              onPress={openModalOnConfirm}>
              <Text style={{color: 'white', fontFamily: 'Poppins-SemiBold'}}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              color: 'black',
              marginBottom: 20,
            }}>
            Do you want to confirm the ride?
          </Text>
          <View
            style={{paddingHorizontal: 50, width: '100%', marginBottom: 10}}>
            <Text style={{fontFamily: 'Poppins-SemiBold', color: 'black'}}>
              From :{' '}
              <Text style={{fontFamily: 'Poppins-Regular'}}>{startAdd}</Text>
            </Text>
            <Text style={{fontFamily: 'Poppins-Medium', color: 'black'}}>
              To : <Text style={{fontFamily: 'Poppins-Regular'}}>{endAdd}</Text>
            </Text>
            <Text style={{fontFamily: 'Poppins-Medium', color: 'black'}}>
              At :{' '}
              <Text style={{fontFamily: 'Poppins-Regular'}}>
                {formattedDate} {timeString}
              </Text>
            </Text>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={{backgroundColor: '#DC5F00', borderRadius: 4}}
              onPress={handleCancel}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                  padding: 5,

                  paddingHorizontal: 15,
                }}>
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{backgroundColor: '#729762', borderRadius: 4}}
              onPress={handleConfirm}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                  padding: 5,

                  paddingHorizontal: 15,
                }}>
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CabPayment;

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 7,
    alignItems: 'center',
    backgroundColor: 'black',
    left: 20,
    top: 20,
    borderRadius: 200,
    zIndex: 100,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheetContent: {
    padding: 20,
    height: 450,
    justifyContent: 'center',
  },
  card: {
    borderColor: '#340092',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#340092',
  },
  cardText: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
    marginTop: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  markerImage: {
    width: 40,
    height: 40,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

  modalButtons: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
