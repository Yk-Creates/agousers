import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageBackground,
  Modal,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import Snackbar from 'react-native-snackbar';
import useBookCab from '../../../hooks/useBookCab';

const Courier = ({route, navigation}: any) => {
  const [address, setAddress] = useState('');
  const [courierDescription, setCourierDescription] = useState('');

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocationSelected, setIsLocationSelected] = useState(false);

  const [showUseCurrentLocationModal, setShowUseCurrentLocationModal] =
    useState(false);
  const [locationFetchingSpinnerState, setLocationFetchingSpinnerState] =
    useState(false);
  const [locationFetched, setLocationFetched] = useState(false);

  const [endAddress, setEndAddress] = useState('');
  const [endLatitude, setEndLatitude] = useState<number | null>(null);
  const [endLongitude, setEndLongitude] = useState<number | null>(null);
  const [isEndLocationSelected, setIsEndLocationSelected] = useState(false);

  const heightAnim = useRef(new Animated.Value(350)).current;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isTimeSelected, setIsTimeSelected] = useState(false);

  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
  const [isEndModalVisible, setIsEndModalVisible] = useState(false);

  const { mutate: bookCab, isPending, isSuccess } = useBookCab();

  const handleStartPress = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null,
  ) => {
    if (details) {
      const {lat, lng} = details.geometry.location;
      setAddress(data.description);
      setLatitude(lat);
      setLongitude(lng);
      setIsLocationSelected(true);
      setIsEndModalVisible(false);
    } else {
      console.error('Details are null');
    }
  };

  const handleEndPress = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null,
  ) => {
    if (details) {
      const {lat, lng} = details.geometry.location;
      setEndAddress(data.description);
      setEndLatitude(lat);
      setEndLongitude(lng);
      setIsEndLocationSelected(true);
      setIsEndModalVisible(false);
    } else {
      console.error('Details are null');
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setIsDateSelected(true);
  };

  const onTimeChange = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
    setIsTimeSelected(true);
  };

  const handleNavigation = () => {
    if (!latitude || !longitude || !endLatitude || !endLongitude) {
      console.error('Location details are missing');
      Snackbar.show({
        text: 'Please complete all location fields',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
      return;
    }
  
    const cabDetails = {
      startLat: latitude,
      startLong: longitude,
      endLat: endLatitude,
      endLong: endLongitude,
      date: date.toISOString(),
      time: time.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'COURRIER',
      model: 'S',
      desc: courierDescription,
    };
  
    console.log('Attempting to book courier with details:', cabDetails);
  
    bookCab(cabDetails, {
      onSuccess: () => {
        console.log('Courier booked successfully');
        navigation.navigate('Profile', cabDetails);
        Snackbar.show({
          text: 'Courier pickup request sent successfully',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'green',
        });
      },
      onError: (error: any) => {
        console.error('Error booking courier:', error);
        Snackbar.show({
          text: 'Failed to book courier. Please try again.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
      },
    });
  };
  
  

  const confirmUseCurrentLocation = () => {
    setAddress('Current Location');
    setIsLocationSelected(true);
    setShowUseCurrentLocationModal(false);
    setLocationFetchingSpinnerState(false);
    setIsEndModalVisible(false);
  };

  const cancelUseCurrentLocation = () => {
    setShowUseCurrentLocationModal(false);
    setIsEndModalVisible(true);
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
        setLocationFetched(true);
        setShowUseCurrentLocationModal(true);
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
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.backgroundImage}
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
            style={{
              color: 'white',
              fontFamily: 'Poppins-Regular',
              fontSize: 20,
            }}>
            Send a Courier
          </Text>
        </View>

        <View style={styles.content}>
          <Animated.View style={[styles.container, {height: heightAnim}]}>
            <TouchableOpacity
              style={styles.addressButton}
              onPress={() => setIsStartModalVisible(true)}>
              <Image
                style={styles.searchIcon}
                source={require('../../../assets/images/search.png')}
              />
              <Text style={styles.addressText}>
                {address || 'Enter Start Address'}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 15,
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'space-between',
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/dots.png')}
              />
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/dots.png')}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.addressButton,
                {
                  borderColor: 'black',
                },
              ]}
              onPress={() => setIsEndModalVisible(true)}>
              <Image
                style={styles.searchIcon}
                source={require('../../../assets/images/search.png')}
              />
              <Text style={styles.addressText}>
                {endAddress || 'Enter End address'}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 15,
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'space-between',
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/dots.png')}
              />
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/dots.png')}
              />
            </View>

            <TouchableOpacity style={styles.description}>
              <TextInput
                style={styles.descriptionText}
                placeholder="Courier Description"
                value={courierDescription}
                onChangeText={text => setCourierDescription(text)}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.goButton,
                {
                  backgroundColor:
                    isLocationSelected &&
                    isEndLocationSelected &&
                    isDateSelected &&
                    isTimeSelected &&
                    courierDescription.trim() !== ''
                      ? '#1B2024'
                      : '#ccc',
                },
              ]}
              onPress={handleNavigation}
              disabled={
                !(
                  isLocationSelected &&
                  isEndLocationSelected &&
                  isDateSelected &&
                  isTimeSelected &&
                  courierDescription.trim() !== ''
                )
              }>
              <Image
                style={styles.arrowIcon}
                source={require('../../../assets/images/right-arrow-white.png')}
              />
            </TouchableOpacity>
          </Animated.View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 35,
              gap: 25,
            }}>
            {/* for selecting date */}
            <View style={styles.DateTime}>
              <TouchableOpacity
                onPress={showDatepicker}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../../../assets/images/calendar.png')}
                />
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: showDatePicker ? '#000' : '#888',
                    marginLeft: 10,
                  }}>
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <View>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    minimumDate={new Date()}
                    onChange={onDateChange}
                    themeVariant="dark"
                    positiveButton={{label: 'OK', textColor: 'blue'}}
                    style={{
                      borderRadius: 100,
                    }}
                  />
                </View>
              )}
            </View>

            {/* for selecting time */}
            <View style={styles.DateTime}>
              <TouchableOpacity
                onPress={showTimepicker}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../../../assets/images/time.png')}
                />
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: showTimePicker ? '#000' : '#888',
                    marginLeft: 10,
                  }}>
                  {time.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <View>
                  <DateTimePicker
                    testID="timePicker"
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={onTimeChange}
                    themeVariant="dark"
                    positiveButton={{label: 'OK', textColor: 'blue'}}
                    style={{
                      borderRadius: 100,
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Modal for Start Address (Arrival Address) */}
        <Modal
          visible={isStartModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsStartModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Arrival Address</Text>
              <GooglePlacesAutocomplete
                placeholder="Enter arrival address"
                onPress={handleStartPress}
                query={{
                  key: 'AIzaSyC8zy45f-dWZWg0P4A9mGAZjNlMYTnJRvI',
                  language: 'en',
                }}
                fetchDetails={true}
                onFail={error => console.error(error)}
                styles={{
                  textInputContainer: styles.inputContainer,
                  textInput: {
                    ...styles.input,
                    color: 'black', // Adjust text color for dark mode
                  },
                  placeholder: {
                    color: 'gray',
                  },
                  description: {
                    color: 'black', // Text color for dropdown items
                  },
                }}
                renderLeftButton={() => (
                  <Image
                    style={styles.searchIcon}
                    source={require('../../../assets/images/search.png')}
                  />
                )}
              />
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
                      <Text
                        style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
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
                            style={{
                              fontFamily: 'Poppins-SemiBold',
                              color: 'green',
                            }}>
                            Location Selected
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text style={{fontFamily: 'Poppins-SemiBold' , color:'black'}}>
                            Select Current Location
                          </Text>
                        </>
                      )}
                    </>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsStartModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal for End Address (Destination Address) */}
        <Modal
          visible={isEndModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEndModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Destination Address</Text>
              <GooglePlacesAutocomplete
                placeholder="Enter destination address"
                onPress={handleEndPress}
                query={{
                  key: 'AIzaSyC8zy45f-dWZWg0P4A9mGAZjNlMYTnJRvI',
                  language: 'en',
                }}
                fetchDetails={true}
                onFail={error => console.error(error)}
                styles={{
                  textInputContainer: styles.inputContainer,
                  textInput: {
                    ...styles.input,
                    color: 'black', // Adjust text color for dark mode
                  },
                  placeholder: {
                    color: 'gray',
                  },
                  description: {
                    color: 'black', // Text color for dropdown items
                  },
                }}
                renderLeftButton={() => (
                  <Image
                    style={styles.searchIcon}
                    source={require('../../../assets/images/search.png')}
                  />
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsEndModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showUseCurrentLocationModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowUseCurrentLocationModal(false)}>
          <View style={styles.modalContainer2}>
            <View style={styles.modalContent2}>
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
    </SafeAreaView>
  );
};

export default Courier;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
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
  content: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    backgroundColor: '#ccc',
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
  addressDetails: {
    padding: 20,
    alignItems: 'center',
  },
  DateTime: {
    width: '37%',
    borderWidth: 1,
    padding: 12,
    borderRadius: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    height: 400,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1B2024',
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    color: '#fff',
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  modalTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    marginBottom: 10,
    color: '#5e5a5a',
  },
  fetchLocationButton: {
    backgroundColor: '#1B2024',
    borderRadius: 15,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  fetchLocationText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },

  addressButton: {
    width: '100%',
    borderWidth: 1,
    padding: 12,
    borderRadius: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },

  addressText: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    flexShrink: 1, // Allow text to shrink to fit
    flex: 1, // Ensure text takes up available space
    overflow: 'hidden', // Hide overflow text
  },

  modalContainer2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent2: {
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
  description: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%',
    padding: 10,
  },
  descriptionText: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    flexShrink: 1,
    flex: 1,
    height: '90%',
    width: '100%',
    textAlignVertical: 'center',
  },
});
