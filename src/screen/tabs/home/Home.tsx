import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageBackground,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const Home = ({navigation}: any) => {
  const [initialLocation, setInitialLocation] = useState({});
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [showUseCurrentLocationModal, setShowUseCurrentLocationModal] =
    useState(false);
  const [locationFetchingSpinnerState, setLocationFetchingSpinnerState] =
    useState(false);
  const [locationFetched, setLocationFetched] = useState(false); // New state for location fetch status
  const heightAnim = useRef(new Animated.Value(300)).current; // Initial height

  const handleFocus = () => {
    setIsInputFocused(true);
    Animated.timing(heightAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!address) {
      setIsInputFocused(false);
      Animated.timing(heightAnim, {
        toValue: 300, // Reset to initial height
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePress = (data, details = null) => {
    if (details) {
      const {lat, lng} = details.geometry.location;
      setInitialLocation(details.geometry.location);
      setAddress(data.description);
      setLatitude(lat);
      setLongitude(lng);
      setIsLocationSelected(true);
      Animated.timing(heightAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      console.error('Details are null');
    }
  };

  const confirmUseCurrentLocation = () => {
    setAddress('Current Location');
    setIsLocationSelected(true);
    setShowUseCurrentLocationModal(false);
    setLocationFetchingSpinnerState(false);
  };

  const cancelUseCurrentLocation = () => {
    setShowUseCurrentLocationModal(false);
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'The app needs access to your location to show your current position.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = () => {
    setLocationFetchingSpinnerState(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('Received location:', latitude, longitude);

        setLatitude(latitude);
        setLongitude(longitude);
        setLocationFetched(true); // Set location fetched status to true
        setShowUseCurrentLocationModal(true); // Show modal when location fetched
      },
      error => {
        console.error('Error fetching location:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <ImageBackground
      source={require('../../../assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{opacity: 0.2}}>
      <View
        style={{
          backgroundColor: '#1B2024',
          width: '100%',
          height: 70,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{color: 'white', fontFamily: 'Poppins-Regular', fontSize: 20}}>
          Schedule a Taxi
        </Text>
      </View>
      <Animated.View style={[styles.container, {height: heightAnim}]}>
        <GooglePlacesAutocomplete
          placeholder="Enter start address"
          onPress={handlePress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          query={{
            key: 'AIzaSyC8zy45f-dWZWg0P4A9mGAZjNlMYTnJRvI',
            language: 'en',
          }}
          fetchDetails={true}
          onFail={error => console.error(error)}
          styles={{
            textInputContainer: styles.inputContainer,
            textInput: styles.input,
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          renderLeftButton={() => (
            <Image
              style={styles.searchIcon}
              source={require('../../../assets/images/search.png')}
            />
          )}
        />
        {address && (
          <View style={styles.locationDetails}>
            <Text style={{fontFamily: 'Poppins-Medium'}}>
              Start Address:{' '}
              <Text style={{fontFamily: 'Poppins-Regular'}}>{address}</Text>
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.goButton,
            {backgroundColor: isLocationSelected ? '#1B2024' : '#ccc'},
          ]}
          onPress={() => {
            console.log('Coordinates sent to arrivalhome:', {
              startLat: latitude,
              startLong: longitude,
              startAdd: address,
            });
            navigation.navigate('arrivalhome', {
              startLat: latitude,
              startLong: longitude,
              startAdd: address,
            });
          }}
          disabled={!isLocationSelected}>
          <Image
            style={styles.arrowIcon}
            source={require('../../../assets/images/right-arrow-white.png')}
          />
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        style={{
          width: '80%',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={getLocation}>
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 20,
            borderWidth: 1,
            flexDirection: 'row',
            borderColor: 'gray',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            borderRadius: 10,
            gap: 10,
          }}>
          {locationFetchingSpinnerState ? (
            <>
              <ActivityIndicator color={'black'} />
              <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
                Fetching Location
              </Text>
            </>
          ) : (
            <>
              <Image
                source={require('../../../assets/images/location-pin.png')}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
              {latitude && longitude ? (
                <>
                  <Text
                    style={{fontFamily: 'Poppins-SemiBold', color: 'green'}}>
                    Location Selected
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{fontFamily: 'Poppins-SemiBold'}}>
                    Select Current Location
                  </Text>
                </>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
          
      <Modal
        visible={showUseCurrentLocationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUseCurrentLocationModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Use current location as pickup address?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: 'red'}]}
                onPress={cancelUseCurrentLocation}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: 'green'}]}
                onPress={confirmUseCurrentLocation}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },

  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
    marginTop: 50,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingTop: 15,
    height: 40,
    paddingLeft: 10,
    borderRadius: 5,
    fontFamily: 'Poppins-Medium',
  },
  searchIcon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  locationDetails: {
    marginTop: 20,
    marginBottom: 20,
  },
  goButton: {
    position: 'absolute',
    bottom: -30,
    left: '50%',
    marginLeft: -10,
    width: '18%',
    height: 50,
    backgroundColor: '#ccc', // Initial disabled color
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  arrowIcon: {
    width: 25,
    height: 25,
    padding: -60,
  },

  button: {
    backgroundColor: 'black',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '24%',
  },
  locationContainer: {
    marginTop: 20,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
});
