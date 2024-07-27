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

const AmbulancePayment = ({route, navigation}) => {
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
  const [selectedCabModel, setSelectedCabModel] = useState(null); // State for selected cab model

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
      let cabModel;
      switch (carType.toLowerCase()) {
        case 'small':
          cabImage = smallCabImage;
          cabModel = 'S';
          break;
        case 'medium':
          cabImage = mediumCabImage;
          cabModel = 'M';
          break;
        case 'large':
          cabImage = largeCabImage;
          cabModel = 'L';
          break;
        default:
          cabImage = smallCabImage; // Default to small cab image
          cabModel = 'S';
          break;
      }

      return (
        <TouchableOpacity
          key={_id}
          style={[
            styles.card,
            selectedCabModel === cabModel ? styles.selectedCard : {},
          ]}
          onPress={() => setSelectedCabModel(cabModel)} // Set selected cab model
        >
          <View>
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
        </TouchableOpacity>
      );
    });
  };

  const {mutate: bookCab, isPending, isSuccess} = useBookCab();

  const handleConfirm = () => {
    if (!selectedCabModel) {
      Snackbar.show({
        text: 'Please select a cab model',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
      return;
    }

    const cabDetails = {
      startLat,
      startLong,
      endLat,
      endLong,
      date: formattedDate,
      time: timeString,
      type: 'AMBULANCE',
      model: selectedCabModel,
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
          <View style={styles.contentContainer}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.text}>
                <Text style={styles.semiBoldText}>From: </Text>
                {startAdd}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.semiBoldText}>To: </Text>
                {endAdd}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.semiBoldText}>at </Text>
                {formattedDate} {timeString}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.semiBoldText}>Distance: </Text>
                {distance.toFixed(2)} km
              </Text>
            </View>

            {/* Cards */}
            <ScrollView horizontal contentContainerStyle={styles.cardContainer}>
              {renderCabCards()}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={openModalOnConfirm}>
                <Text style={styles.buttonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>

        {/* Confirmation Modal */}
        <Modal isVisible={isModalVisible} animationIn="slideInUp">
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Confirm Booking?</Text>
            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={handleCancel} color="red" />
              <Button title="Confirm" onPress={handleConfirm} color="green" />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

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
    flex: 1,
  },
  markerImage: {
    width: 25,
    height: 25,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  semiBoldText: {
    fontFamily: 'Poppins-SemiBold',
  },
  cardContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    width: 150,
    height: 200,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    borderColor: 'green', // Highlight the selected card
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  // buttonContainer: {
  //   marginTop: 20,
  // },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold', // Change this to your desired font family
    fontSize: 16,
  },
});

export default AmbulancePayment;
