import DateTimePicker from '@react-native-community/datetimepicker'; // For Date Picker
import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const ArrivalHome = ({route, navigation}) => {
  const {startLat, startLong, startAdd} = route.params; // Receive date here
  const [endAddress, setEndAddress] = useState('');
  const [endLatitude, setEndLatitude] = useState(null);
  const [endLongitude, setEndLongitude] = useState(null);
  const [isEndLocationSelected, setIsEndLocationSelected] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date()); // Initialize with current date
  const [isDateSelected, setIsDateSelected] = useState(false); // Track date selection

  const heightAnim = useRef(new Animated.Value(400)).current;

  const handleEndFocus = () => {
    Animated.timing(heightAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleEndBlur = () => {
    if (!endAddress) {
      Animated.timing(heightAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleEndPress = (data, details = null) => {
    if (details) {
      const {lat, lng} = details.geometry.location;
      setEndAddress(data.description);
      setEndLatitude(lat);
      setEndLongitude(lng);

      Animated.timing(heightAnim, {
        toValue: 250,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      console.error('Details are null');
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false); // Ensure this sets showDatePicker to false
    setDate(currentDate);
    setIsDateSelected(true);
    setIsEndLocationSelected(true);
  };
  

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.backgroundImage}
        imageStyle={{opacity: 0.2}}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', gap: 5}}
            onPress={() => navigation.goBack()}>
            <Image
              style={styles.backIcon}
              source={require('../../../assets/images/back-stick.png')}
            />
            <Text style={styles.headerText}>back</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Set Arrival Location</Text>
        </View>

        <View style={styles.content}>
          <Animated.View style={[styles.container, {height: heightAnim}]}>
            <View
              style={{
                width: '100%',
                borderWidth: 1,
                padding: 12,
                borderRadius: 15,
                paddingHorizontal: 10,
                flexDirection: 'row',
                gap: 10,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/search.png')}
              />
              <Text style={{fontFamily: 'Poppins-Medium', color: 'black'}}>
                {startAdd.length > 20
                  ? `${startAdd.substring(0, 20)}...`
                  : startAdd}
              </Text>
            </View>
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
            <GooglePlacesAutocomplete
              placeholder="Enter end address"
              onPress={handleEndPress}
              onFocus={handleEndFocus}
              onBlur={handleEndBlur}
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
            {endAddress && (
              <View style={styles.locationDetails}>
                <Text style={{fontFamily: 'Poppins-Medium'}}>
                  End Address:{' '}
                  <Text style={{fontFamily: 'Poppins-Regular'}}>
                    {' '}
                    {endAddress}
                  </Text>
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.goButton,
                {backgroundColor: isEndLocationSelected ? '#340092' : '#ccc'},
              ]}
              onPress={() => {
                // Handle the next step with start and end locations
              }}
              disabled={!(isEndLocationSelected && isDateSelected)}>
              <Image
                style={styles.arrowIcon}
                source={require('../../../assets/images/right-arrow-white.png')}
              />
            </TouchableOpacity>
          </Animated.View>

          <View
            style={{
              width: '80%',
              borderWidth: 1,
              padding: 12,
              borderRadius: 15,
              paddingHorizontal: 10,
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              backgroundColor: '#fff',
              marginTop: 40,
            }}>
            <TouchableOpacity
              onPress={showDatepicker}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 30, height: 30}}
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
                  mode="date" // You can also use 'time' or 'datetime'
                  is24Hour={true} // Adjust as needed
                  display="default" // Adjust as needed
                  minimumDate={new Date()} // Only show dates after today
                  onChange={onChange}
                  themeVariant="dark"
                  display="spinner"
                  positiveButton={{label: 'OK', textColor: 'blue'}}
                  style={{
                    borderRadius: 100,
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ArrivalHome;

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
  },
  backIcon: {
    width: 15,
    height: 15,
  },
  headerText: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -155,
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
});
